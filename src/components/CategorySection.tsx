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
  const doneCount = done.filter((id) => sources.some((s) => s.id === id)).length

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-900/50 pb-2 select-none">
        <span className="text-xl leading-none">{cat.emoji}</span>
        <h2 className="text-sm font-extrabold uppercase tracking-widest bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          {cat.label}
        </h2>
        <span className="rounded-full bg-zinc-900/50 px-2 py-0.5 text-[11px] font-bold text-zinc-500">
          {doneCount} / {sources.length}
        </span>
        {sectionDone && (
          <span className="ml-auto flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            已完成 <span className="text-xs">✓</span>
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
