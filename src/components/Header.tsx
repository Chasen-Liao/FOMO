type Props = {
  date: Date
  progress: number
  total: number
  streak: number
}

const ProgressRing = ({ value, total }: { value: number; total: number }) => {
  const r = 26
  const c = 2 * Math.PI * r
  const pct = total > 0 ? value / total : 0
  const done = value >= total && total > 0
  return (
    <div className="relative h-[68px] w-[68px]">
      <svg className="h-[68px] w-[68px] -rotate-90" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={r} fill="none" stroke="#26262b" strokeWidth="6" />
        <circle
          cx="34"
          cy="34"
          r={r}
          fill="none"
          stroke={done ? '#34d399' : '#8b5cf6'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold leading-none">
          {value}
          <span className="text-[11px] font-medium text-zinc-500">/{total}</span>
        </span>
      </div>
    </div>
  )
}

export default function Header({ date, progress, total, streak }: Props) {
  const allDone = progress >= total && total > 0
  return (
    <header className="relative border-b border-zinc-900/60 bg-zinc-950/45 backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-5 sm:px-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-2xl shadow-lg shadow-violet-500/20 animate-pulse [animation-duration:6s]">
          👁️
        </div>
        <div className="flex-1">
          <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            FOMO
            <span className="rounded-md bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
              AI DAILY
            </span>
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            {date.getFullYear()} 年 {date.getMonth() + 1} 月 {date.getDate()} 日
            {' · '}
            {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">连续追踪</div>
            <div className="flex items-center justify-end gap-1 select-none">
              <span className="text-lg font-black bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                {streak} 天
              </span>
              <span className="text-base animate-bounce origin-bottom inline-block [animation-duration:1.5s]">🔥</span>
            </div>
          </div>
          <ProgressRing value={progress} total={total} />
        </div>
      </div>
      {allDone && (
        <div className="border-t border-emerald-950 bg-emerald-950/25 py-2 text-center text-xs font-semibold text-emerald-400 tracking-wide">
          ✓ 今日清单已全部完成，完美守护！
        </div>
      )}
      {/* 底部渐变细饰条 */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/25 to-transparent" />
    </header>
  )
}
