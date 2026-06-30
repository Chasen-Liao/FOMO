import type { CategoryMeta, FeedItem, Source } from '../types'
import SourceCard from './SourceCard'

type Props = {
  cat: CategoryMeta
  sources: Source[]
  feeds: Record<string, FeedItem[]>
  feedsLoaded: boolean
  done: string[]
  onToggle: (id: string) => void
  index: number
}

export default function CategorySection({
  cat,
  sources,
  feeds,
  feedsLoaded,
  done,
  onToggle,
  index,
}: Props) {
  const doneInCat = sources.filter((s) => done.includes(s.id)).length
  const allDone = doneInCat === sources.length
  
  const numStr = ['一', '二', '三', '四', '五'][index] || (index + 1).toString()

  // Add spaces between characters for the paper style label (e.g. "新 闻")
  const labelWithSpaces = cat.label.split('').join(' ')

  return (
    <section className="section">
      <div className="section-head">
        <span className="section-num">{numStr}、</span>
        <span className="section-title">{labelWithSpaces}</span>
        <span className="section-rule"></span>
        <span className="section-meta" data-cat={cat.id}>
          {allDone ? (
            <span className="done-mark">✓ 全部完成</span>
          ) : (
            <>待打卡 <span className="cat-count">{doneInCat}/{sources.length}</span></>
          )}
        </span>
      </div>
      <div className="rows">
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
