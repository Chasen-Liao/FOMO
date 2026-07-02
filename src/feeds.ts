import type { FeedItem, Source } from './types'

/** 多个公共 CORS 代理，逐个尝试，提升可达性 */
const PROXIES: ((u: string) => string)[] = [
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  (u) => `https://thingproxy.freeboard.io/fetch/${u}`,
]

const withTimeout = (ms: number) => {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  return { signal: ctrl.signal, clear: () => clearTimeout(t) }
}

const fetchViaProxy = async (url: string, timeoutMs = 10000): Promise<string> => {
  let lastErr: unknown
  for (const wrap of PROXIES) {
    const { signal, clear } = withTimeout(timeoutMs)
    try {
      const res = await fetch(wrap(url), { signal })
      if (res.ok) {
        const text = await res.text()
        if (text && text.length > 0) return text
      }
    } catch (e) {
      lastErr = e
    } finally {
      clear()
    }
  }
  throw lastErr ?? new Error('所有代理均失败')
}

const toAbsoluteUrl = (url: string, baseUrl?: string): string => {
  try {
    return new URL(url, baseUrl).href
  } catch {
    return url
  }
}

const parseRss = (xml: string, limit = 3, baseUrl?: string): FeedItem[] => {
  const doc = new DOMParser().parseFromString(xml, 'text/xml')
  const nodes = Array.from(doc.querySelectorAll('item, entry')).slice(0, limit)
  return nodes
    .map((it) => {
      const title = it.querySelector('title')?.textContent?.trim() ?? ''
      const link =
        it.querySelector('link')?.textContent?.trim() ||
        it.querySelector('link')?.getAttribute('href') ||
        ''
      const date =
        it.querySelector('pubDate, published, updated')?.textContent?.trim() || undefined
      return { title, url: toAbsoluteUrl(link, baseUrl), publishedAt: date }
    })
    .filter((x) => x.title && x.url)
}

const parseHtmlLinks = (
  html: string,
  baseUrl: string,
  linkSelector: string,
  limit = 3
): FeedItem[] => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const seen = new Set<string>()
  return Array.from(doc.querySelectorAll<HTMLAnchorElement>(linkSelector))
    .map((a) => ({
      title: a.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      url: toAbsoluteUrl(a.getAttribute('href') ?? '', baseUrl),
    }))
    .filter((item) => {
      if (!item.title || !item.url || seen.has(item.url)) return false
      seen.add(item.url)
      return true
    })
    .slice(0, limit)
}

const fetchOpenRouter = async (limit = 3): Promise<FeedItem[]> => {
  const { signal, clear } = withTimeout(12000)
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', { signal })
    if (!res.ok) throw new Error('openrouter ' + res.status)
    const json = await res.json()
    const models: Array<{
      id: string
      name?: string
      created?: number
    }> = json.data ?? []
    return models
      .filter((m) => typeof m.created === 'number')
      .sort((a, b) => (b.created ?? 0) - (a.created ?? 0))
      .slice(0, limit)
      .map((m) => ({
        title: m.name || m.id,
        url: `https://openrouter.ai/models/${m.id}`,
        publishedAt: m.created
          ? new Date(m.created * 1000).toISOString()
          : undefined,
      }))
  } finally {
    clear()
  }
}

/** 抓取单个源的预览，失败时返回空数组（由 UI 降级为纯启动器） */
export const fetchFeed = async (source: Source): Promise<FeedItem[]> => {
  if (!source.feed) return []
  try {
    if (source.feed.kind === 'openrouter') return await fetchOpenRouter()
    const text = await fetchViaProxy(source.feed.url)
    if (source.feed.kind === 'html') {
      return parseHtmlLinks(text, source.feed.baseUrl, source.feed.linkSelector)
    }
    return parseRss(text, 3, source.feed.url)
  } catch {
    return []
  }
}
