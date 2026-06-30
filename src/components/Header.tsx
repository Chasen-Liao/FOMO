
type Props = {
  date: Date
  progress: number
  total: number
  streak: number
}

export default function Header({ date, progress, total, streak }: Props) {
  const pad = (n: number) => String(n).padStart(2, '0')
  const dateStr = `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`
  const weekStr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
  
  const ratio = total ? progress / total : 0
  const circ = 2 * Math.PI * 44
  const dashOffset = circ * (1 - ratio)

  return (
    <>
      <div className="progress-stamp" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <circle className="ring-bg" cx="50" cy="50" r="44" />
          <circle 
            className="ring" 
            cx="50" 
            cy="50" 
            r="44"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 50 50)"
            strokeLinecap="round"
          />
          <text className="num" x="50" y="50">{progress}/{total}</text>
          <text className="lab" x="50" y="64">今日进度</text>
        </svg>
      </div>

      <header className="form-head">
        <div>
          <h1 className="form-title">
            FOMO
            <span className="sub">每 日 A I 信 息 源 打 卡 纸</span>
          </h1>
        </div>
        <div className="form-meta">
          <div><span className="lbl">日期</span><span className="val">{dateStr}</span></div>
          <div><span className="lbl">星期</span><span className="val">{weekStr}</span></div>
          <div><span className="lbl">连续</span><span className="val streak-val">{streak} 天</span></div>
        </div>
      </header>
    </>
  )
}
