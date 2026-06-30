import { useEffect, useState } from 'react'
import { CATEGORIES, SOURCES } from './sources'
import { fetchFeed } from './feeds'
import { computeStreak, getDone, saveDone, getFeedsCache, saveFeedsCache } from './storage'
import type { FeedItem } from './types'
import Header from './components/Header'
import CategorySection from './components/CategorySection'

export default function App() {
  const [done, setDone] = useState<string[]>(() => getDone())
  const [feeds, setFeeds] = useState<Record<string, FeedItem[]>>({})
  const [feedsLoaded, setFeedsLoaded] = useState(false)
  const [streak, setStreak] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    setStreak(computeStreak())
    
    // Hint bubble timing
    const t1 = setTimeout(() => setShowHint(true), 600)
    const t2 = setTimeout(() => setShowHint(false), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const loadFeeds = async (force = false) => {
    setRefreshing(true)
    const cache = getFeedsCache()
    const now = Date.now()

    if (!force && cache && now - cache.updatedAt < 30 * 60 * 1000) {
      setFeeds(cache.feeds)
      setLastUpdated(
        new Date(cache.updatedAt).toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
      setFeedsLoaded(true)
      setRefreshing(false)
      return
    }

    const feedSources = SOURCES.filter((s) => s.feed)
    try {
      const entries = await Promise.all(
        feedSources.map(async (s) => [s.id, await fetchFeed(s)] as const)
      )
      const nextFeeds = Object.fromEntries(entries)

      if (cache) {
        for (const [id, items] of Object.entries(nextFeeds)) {
          if (items.length === 0 && cache.feeds[id] && cache.feeds[id].length > 0) {
            nextFeeds[id] = cache.feeds[id]
          }
        }
      }

      setFeeds(nextFeeds)
      saveFeedsCache(nextFeeds, now)
      setLastUpdated(
        new Date(now).toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
      setFeedsLoaded(true)
    } catch {
      if (cache) {
        setFeeds(cache.feeds)
        setLastUpdated(
          new Date(cache.updatedAt).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })
        )
      }
      setFeedsLoaded(true)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadFeeds(false)
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
          <span>※ 依次过一遍，每看一个就在前面方框里打勾。低功耗过一遍眼睛，重要的事大概率就不会错过了。</span>
          <span className="feed-cache-info">
            {lastUpdated ? `（已缓存，上次更新：${lastUpdated}）` : refreshing ? '（正在加载最新信息...）' : ''}
            <button
              className="btn-refresh"
              onClick={() => loadFeeds(true)}
              disabled={refreshing}
              title="重新获取最新数据并刷新缓存"
            >
              {refreshing ? '正在刷新...' : '↻ 强制刷新'}
            </button>
          </span>
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

      <a
        href="https://github.com/Chasen-Liao"
        target="_blank"
        rel="noreferrer noopener"
        className="author-signature"
      >
        chasen
      </a>
    </>
  )
}
