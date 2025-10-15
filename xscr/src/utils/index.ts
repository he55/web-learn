export const getNowString = () => {
  const date = new Date()
  const a = date.toLocaleString().slice(2, -3)
  const day = date.getDay()
  const dayNames = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const dayName = dayNames[day]!
  return `${a} ${dayName}`
}
