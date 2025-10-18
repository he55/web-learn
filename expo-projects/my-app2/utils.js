import AsyncStorage from '@react-native-async-storage/async-storage'

export const loadConfig = async () => {
  const json = await AsyncStorage.getItem('config')
  if (!json) {
    return null
  }

  return JSON.parse(json)
}

export const getConfig = async () => {
  const url = await AsyncStorage.getItem('url')
  if (!url) {
    throw new Error('config url is not empty')
  }

  const res = await fetch(url, { cache: 'no-cache' })
  if (!res.ok) {
    throw new Error('get config failed')
  }

  const config = await res.json()
  config.backgroundImageUrl = new URL(config.backgroundImageUrl, url).href
  config.videoUrl = new URL(config.videoUrl, url).href
  config.dataUrl = new URL(config.dataUrl, url).href

  const json = JSON.stringify(config)

  await AsyncStorage.setItem('config', json)

  return config
}

export const getData = async (url) => {
  const data = {
    text1: '',
    text2: '',
    text3: '',
  }

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('get data failed')
  }

  const list = await res.json()
  if (!list.length) {
    return data
  }

  const a1 = list.find((x) => x.state === 1 && x.deptAlias === '肌骨超声1')
  if (a1) {
    data.text1 = `${a1.number} ${a1.name}`
  }

  const a2 = list.find((x) => x.state === 1 && x.deptAlias === '肌骨超声2')
  if (a2) {
    data.text2 = `${a2.number} ${a2.name}`
  }

  /** @type {[]} */
  const b = list.filter((x) => x.state === 0)
  if (b.length) {
    data.text3 = b
      .slice(0, 6)
      .map((x) => `${x.number} ${x.name}`)
      .join('\n')
  }

  return data
}
