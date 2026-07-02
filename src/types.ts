export type Category = 'news' | 'blog' | 'model'

export type FeedItem = {
  title: string
  url: string
  publishedAt?: string
}

export type SourceFeed =
  | { kind: 'rss'; url: string }
  | { kind: 'html'; url: string; baseUrl: string; linkSelector: string }
  | { kind: 'openrouter' }

export type Source = {
  id: string
  name: string
  category: Category
  url: string
  desc: string
  feed?: SourceFeed
  fallbackPreview?: FeedItem[]
}

export type CategoryMeta = {
  id: Category
  label: string
  emoji: string
}
