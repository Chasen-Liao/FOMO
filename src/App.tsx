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
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    setStreak(computeStreak())
    
    // Hint bubble timing
    const t1 = setTimeout(() => setShowHint(true), 600)
    const t2 = setTimeout(() => setShowHint(false), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

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
  const allDone = done.length >= total && total > 0

  return (
    <>
      <div className={`hint ${showHint ? 'show' : ''}`} id="hint">
        点击方框即可打卡
      </div>

      <article className={`sheet ${allDone ? 'all-done' : ''}`} id="sheet">
        <span className="tape" aria-hidden="true"></span>
        <span className="margin-line" aria-hidden="true"></span>
        <span className="punch p1" aria-hidden="true"></span>
        <span className="punch p2" aria-hidden="true"></span>
        <span className="punch p3" aria-hidden="true"></span>
        <div className="ruled" aria-hidden="true"></div>

        <Header date={today} progress={done.length} total={total} streak={streak} />

        <p className="form-note">
          ※ 依次过一遍，每看一个就在前面方框里打勾。低功耗过一遍眼睛，重要的事大概率就不会错过了。
        </p>

        <div id="sections">
          {CATEGORIES.map((cat, index) => (
            <CategorySection
              key={cat.id}
              cat={cat}
              sources={SOURCES.filter((s) => s.category === cat.id)}
              feeds={feeds}
              feedsLoaded={feedsLoaded}
              done={done}
              onToggle={toggle}
              index={index}
            />
          ))}
        </div>

        <div className="completion-stamp" aria-hidden="true">
          <div className="seal">
            <div className="big">已打卡</div>
            <div className="small">今日完美守护</div>
          </div>
        </div>

        <footer className="form-foot">
          <span>FOMO · 数据保存在你的浏览器本地，不上传任何信息</span>
          <span className="sign">— AI Daily —</span>
          <a
            href="https://github.com/Chasen-Liao/FOMO"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
        </footer>
      </article>
    </>
  )
}
