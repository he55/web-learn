export const getNowString = () => {
  const date = new Date()
  const a = date.toLocaleString().slice(2, -3)
  const day = date.getDay()
  const dayNames = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const dayName = dayNames[day]!
  return `${a} ${dayName}`
}

export const statusFormat = (status: number) => {
  if (status === 0) {
    return '等待中'
  } else if (status === 1) {
    return '手术中'
  } else if (status === 2) {
    return '完成'
  } else {
    return ''
  }
}

export const dateFormat = (timestamp: number) => {
  const date = new Date(timestamp)
  date.setHours(date.getHours() + 8)
  return date.toLocaleString()
}

export const nameFix = (str: string) => {
  if (str.length < 2) {
    return str
  }

  const s = str.at(0)
  if (str.length === 2) {
    return `${s}*`
  }

  const e = str.at(-1)
  const stars = '*'.repeat(str.length - 2)
  return `${s}${stars}${e}`
}
