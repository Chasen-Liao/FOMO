export const formatToday = (d: Date): string => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日 · ${weekdays[d.getDay()]}`
}

export const relativeTime = (iso?: string): string => {
  if (!iso) return ''
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return ''
  const diff = Date.now() - t
  const day = 86400000
  if (diff < 0) return '刚刚'
  const days = Math.floor(diff / day)
  if (days < 1) {
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.max(1, Math.floor(diff / 60000))} 分钟前`
    return `${hours} 小时前`
  }
  if (days < 30) return `${days} 天前`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} 个月前`
  return `${Math.floor(months / 12)} 年前`
}
