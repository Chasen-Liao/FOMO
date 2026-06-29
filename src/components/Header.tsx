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
    <header className="border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-5 sm:px-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-2xl shadow-lg shadow-violet-900/40">
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
            <div className="text-[11px] uppercase tracking-wide text-zinc-500">连续</div>
            <div className="text-lg font-bold text-amber-400">{streak} 天 🔥</div>
          </div>
          <ProgressRing value={progress} total={total} />
        </div>
      </div>
      {allDone && (
        <div className="border-t border-emerald-900/40 bg-emerald-950/30 py-1.5 text-center text-xs font-medium text-emerald-300">
          ✓ 今日清单已全部完成，没有掉队！
        </div>
      )}
    </header>
  )
}
