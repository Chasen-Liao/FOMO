import type { CategoryMeta, FeedItem, Source } from '../types'
import SourceCard from './SourceCard'

type Props = {
  cat: CategoryMeta
  sources: Source[]
  feeds: Record<string, FeedItem[]>
  feedsLoaded: boolean
  done: string[]
  onToggle: (id: string) => void
}

export default function CategorySection({
  cat,
  sources,
  feeds,
  feedsLoaded,
  done,
  onToggle,
}: Props) {
  const sectionDone = sources.every((s) => done.includes(s.id))

  return (
    <section className="mb-10">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">{cat.emoji}</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
          {cat.label}
        </h2>
        <span className="text-xs text-zinc-600">
          {done.filter((id) => sources.some((s) => s.id === id)).length}/{sources.length}
        </span>
        {sectionDone && (
          <span className="ml-auto text-xs font-medium text-emerald-400">已完成 ✓</span>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((s) => (
          <SourceCard
            key={s.id}
            source={s}
            items={feeds[s.id]}
            loading={!feedsLoaded}
            done={done.includes(s.id)}
            onToggle={() => onToggle(s.id)}
          />
        ))}
      </div>
    </section>
  )
}
