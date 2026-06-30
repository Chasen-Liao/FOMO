import type { FeedItem } from './types'

const dateKey = (d = new Date()): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `fomo:${y}-${m}-${day}`
}

export const getDone = (): string[] => {
  try {
    const raw = localStorage.getItem(dateKey())
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export const saveDone = (ids: string[]): void => {
  try {
    localStorage.setItem(dateKey(), JSON.stringify(ids))
  } catch {
    /* 存储不可用时静默失败 */
  }
}

/** 从今天往回数，连续有完成记录的天数（今天尚无记录不中断） */
export const computeStreak = (): number => {
  let streak = 0
  const d = new Date()
  for (let i = 0; i < 365; i++) {
    let hasRecord = false
    try {
      const raw = localStorage.getItem(dateKey(d))
      const arr = raw ? JSON.parse(raw) : []
      hasRecord = Array.isArray(arr) && arr.length > 0
    } catch {
      hasRecord = false
    }
    if (hasRecord) {
      streak++
    } else if (i > 0) {
      break
    }
    d.setDate(d.getDate() - 1)
  }
  return streak
}

interface FeedsCache {
  updatedAt: number
  feeds: Record<string, FeedItem[]>
}

const FEEDS_CACHE_KEY = 'fomo:feeds_cache'

export const getFeedsCache = (): FeedsCache | null => {
  try {
    const raw = localStorage.getItem(FEEDS_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.updatedAt === 'number' && parsed.feeds) {
      return parsed
    }
  } catch {
    /* 存储不可用时静默失败 */
  }
  return null
}

export const saveFeedsCache = (feeds: Record<string, FeedItem[]>, updatedAt = Date.now()): void => {
  try {
    const data: FeedsCache = { updatedAt, feeds }
    localStorage.setItem(FEEDS_CACHE_KEY, JSON.stringify(data))
  } catch {
    /* 存储不可用时静默失败 */
  }
}
