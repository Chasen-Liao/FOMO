import type { FeedItem, Source } from '../types'
import { relativeTime } from '../utils'

type Props = {
  source: Source
  items?: FeedItem[]
  loading: boolean
  done: boolean
  onToggle: () => void
}

export default function SourceCard({ source, items, loading, done, onToggle }: Props) {
  const hasFeed = !!source.feed
  const showPreview = hasFeed && items !== undefined && items.length > 0
  const previewLoading = hasFeed && loading

  return (
    <div
      className={`fomo-fade group relative flex flex-col rounded-2xl border p-4 transition-all duration-300 backdrop-blur-md ${
        done
          ? 'border-emerald-500/25 bg-emerald-950/15 shadow-md shadow-emerald-950/10'
          : 'border-zinc-800/60 bg-zinc-900/25 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-zinc-900/40 hover:shadow-lg hover:shadow-violet-950/15'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 font-semibold text-zinc-100 hover:text-violet-300 transition-colors"
          >
            {source.name}
            <svg
              className="h-3.5 w-3.5 text-zinc-500 transition-colors group-hover:text-violet-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400 transition-colors group-hover:text-zinc-300">
            {source.desc}
          </p>
        </div>
        <button
          onClick={onToggle}
          aria-pressed={done}
          aria-label={done ? '标记为未完成' : '标记为已完成'}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
            done
              ? 'border-emerald-500 bg-emerald-500 text-zinc-950 animate-bounce-scale shadow-md shadow-emerald-500/20'
              : 'border-zinc-700 text-transparent hover:border-violet-400 hover:text-violet-400 hover:scale-105'
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {previewLoading && (
        <div className="mt-4 space-y-2">
          <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-800/80" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-800/80" />
        </div>
      )}

      {showPreview && (
        <ul className="mt-4 space-y-2 border-t border-zinc-800/50 pt-3.5">
          {items!.slice(0, 3).map((it, i) => (
            <li key={i}>
              <a
                href={it.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group/item flex items-baseline gap-2 text-xs text-zinc-400 hover:text-violet-300 transition-colors"
              >
                <span className="truncate">{it.title}</span>
                {it.publishedAt && (
                  <span className="ml-auto shrink-0 text-[10px] text-zinc-500 transition-colors group-hover/item:text-zinc-400">
                    {relativeTime(it.publishedAt)}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}

      {!hasFeed && (
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex w-fit items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/10 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-violet-500/30 hover:bg-violet-950/10 hover:text-violet-300 transition-all duration-300"
        >
          前往
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      )}
    </div>
  )
}
