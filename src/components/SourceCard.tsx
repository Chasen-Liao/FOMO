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
  const showGoArrow = !showPreview && !(hasFeed && loading)

  return (
    <div 
      className={`row ${done ? 'done' : ''}`}
      role="checkbox"
      tabIndex={0}
      aria-checked={done ? 'true' : 'false'}
      aria-label={`${source.name} 打卡项`}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onToggle()
        }
      }}
    >
      <span className="check" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path className="box" d="M3 4.5 L20 3.5 L21 19.5 L4 20.5 Z"/>
          <path className="tick" d="M6 12 L10 15.5 L18 7.5"/>
        </svg>
      </span>
      <div className="row-body">
        <a 
          className="row-name" 
          href={source.url} 
          target="_blank" 
          rel="noreferrer noopener"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {source.name}
          <svg className="ext" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <div className="row-desc">{source.desc}</div>
        
        {loading && hasFeed && (
          <div className="row-preview" style={{ opacity: 0.6 }}>
            <li><span className="t" style={{ fontStyle: 'italic', color: 'var(--ink-soft)' }}>加载中...</span></li>
          </div>
        )}

        {showPreview && (
          <ul className="row-preview">
            {items!.slice(0, 3).map((it, i) => (
              <li key={i}>
                <a 
                  href={it.url} 
                  target="_blank" 
                  rel="noreferrer noopener" 
                  onClick={(e) => e.stopPropagation()}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <span className="t">{it.title}</span>
                  {it.publishedAt && (
                    <span className="d">{relativeTime(it.publishedAt)}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      {showGoArrow && (
        <a 
          href={source.url} 
          target="_blank" 
          rel="noreferrer noopener" 
          className="go-arrow" 
          onClick={(e) => e.stopPropagation()}
          style={{ textDecoration: 'none' }}
        >
          前往 ↗
        </a>
      )}
    </div>
  )
}
