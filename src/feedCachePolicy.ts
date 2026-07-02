import type { FeedItem } from './types'

export const applyFeedCacheFallback = (
  feeds: Record<string, FeedItem[]>,
  cachedFeeds: Record<string, FeedItem[]> | undefined,
  force: boolean
): Record<string, FeedItem[]> => {
  if (force || !cachedFeeds) return feeds

  const nextFeeds = { ...feeds }
  for (const [id, items] of Object.entries(nextFeeds)) {
    if (items.length === 0 && cachedFeeds[id] && cachedFeeds[id].length > 0) {
      nextFeeds[id] = cachedFeeds[id]
    }
  }
  return nextFeeds
}
