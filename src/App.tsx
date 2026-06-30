import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
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

  useEffect(() => setStreak(computeStreak()), [])

  useEffect(() => {
    const glow = document.getElementById('mouse-glow')
    if (!glow) return

    const handleMouseMove = (e: MouseEvent) => {
      glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      glow.style.opacity = '1'
    }

    const handleMouseLeave = () => {
      glow.style.opacity = '0'
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
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

    const total = SOURCES.length
    if (next.length === total && total > 0 && done.length < total) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#8b5cf6', '#a78bfa', '#34d399', '#f59e0b', '#ec4899'],
      })
    }
  }

  const today = new Date()
  const total = SOURCES.length

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 selection:bg-violet-500/30 overflow-x-hidden">
      {/* 鼠标跟随动态微光 */}
      <div
        id="mouse-glow"
        className="pointer-events-none fixed -left-[150px] -top-[150px] h-[300px] w-[300px] rounded-full bg-violet-500/12 blur-[100px] transition-opacity duration-700 opacity-0 will-change-transform"
        style={{ transform: 'translate3d(0px, 0px, 0)' }}
      />

      {/* 氛围渐变光晕 */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-violet-600/12 blur-[130px] animate-float-1" />
      <div className="pointer-events-none absolute top-1/4 -right-40 h-[700px] w-[700px] rounded-full bg-fuchsia-600/8 blur-[145px] animate-float-2" />
      <div className="pointer-events-none absolute bottom-20 -left-20 h-[600px] w-[600px] rounded-full bg-emerald-600/7 blur-[130px] animate-float-3" />

      <Header date={today} progress={done.length} total={total} streak={streak} />
      <main className="relative z-10 mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <p className="mb-6 text-sm text-zinc-400">
          依次点过一遍，每看一个就标记完成。低功耗过一遍眼睛，重要的事大概率不会错过了。
        </p>
        {CATEGORIES.map((cat) => (
          <CategorySection
            key={cat.id}
            cat={cat}
            sources={SOURCES.filter((s) => s.category === cat.id)}
            feeds={feeds}
            feedsLoaded={feedsLoaded}
            done={done}
            onToggle={toggle}
          />
        ))}
      </main>
      <footer className="relative z-10 border-t border-zinc-800/60 py-6 text-center text-xs text-zinc-600">
        <p>
          FOMO · 每日 AI 信息源追踪 ·{' '}
          <a
            className="text-zinc-500 hover:text-violet-300 transition-colors"
            href="https://github.com/Chasen-Liao/FOMO"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
        </p>
        <p className="mt-1 text-zinc-700">数据保存在你的浏览器本地，不上传任何信息。</p>
      </footer>
    </div>
  )
}
