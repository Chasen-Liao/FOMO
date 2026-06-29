import { useEffect, useState } from 'react'
import { CATEGORIES, SOURCES } from './sources'
import { fetchFeed } from './feeds'
import { computeStreak, getDone, saveDone } from './storage'
import type { FeedItem } from './types'
import Header from './components/Header'
import CategorySection from './components/CategorySection'

export default function App() {
  const [done, setDone] = useState<string[]>(() => getDone())
  const [feeds, setFeeds] = useState<Record<string, FeedItem[]>>({})
  const [feedsLoaded, setFeedsLoaded] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => setStreak(computeStreak()), [])

  useEffect(() => {
    let active = true
    const feedSources = SOURCES.filter((s) => s.feed)
    Promise.all(
      feedSources.map(async (s) => [s.id, await fetchFeed(s)] as const),
    )
      .then((entries) => {
        if (!active) return
        setFeeds(Object.fromEntries(entries))
        setFeedsLoaded(true)
      })
      .catch(() => setFeedsLoaded(true))
    return () => {
      active = false
    }
  }, [])

  const toggle = (id: string) => {
    const next = done.includes(id) ? done.filter((x) => x !== id) : [...done, id]
    setDone(next)
    saveDone(next)
    setStreak(computeStreak())
  }

  const today = new Date()
  const total = SOURCES.length

  return (
    <div className="min-h-screen">
      <Header date={today} progress={done.length} total={total} streak={streak} />
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <p className="mb-6 text-sm text-zinc-500">
          依次点过一遍，每看一个就标记完成。低功耗过一遍眼睛，重要的事大概率不会错过了。
        </p>
        {CATEGORIES.map((cat) => (
          <CategorySection
            key={cat.id}
            cat={cat}
            sources={SOURCES.filter((s) => s.category === cat.id)}
            feeds={feeds}
            feedsLoaded={feedsLoaded}
            done={done}
            onToggle={toggle}
          />
        ))}
      </main>
      <footer className="border-t border-zinc-800/60 py-6 text-center text-xs text-zinc-600">
        <p>
          FOMO · 每日 AI 信息源追踪 ·{' '}
          <a
            className="text-zinc-500 hover:text-violet-300"
            href="https://github.com/Chasen-Liao/FOMO"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
        </p>
        <p className="mt-1 text-zinc-700">数据保存在你的浏览器本地，不上传任何信息。</p>
      </footer>
    </div>
  )
}
