import AsyncStorage from '@react-native-async-storage/async-storage'

export type Config = {
  name: string
  backgroundImageUrl: string
  videoMuted: boolean
  videoUrl: string
  dataUrl: string
}

type CallData = {
  name: string
  number: number
  state: number
}

export const loadConfig = async () => {
  const json = await AsyncStorage.getItem('config')
  if (!json) {
    return null
  }

  return JSON.parse(json) as Config
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

  const config: Config = await res.json()
  config.backgroundImageUrl = new URL(config.backgroundImageUrl, url).href
  config.videoUrl = new URL(config.videoUrl, url).href
  config.dataUrl = new URL(config.dataUrl, url).href

  const json = JSON.stringify(config)

  await AsyncStorage.setItem('config', json)

  return config
}

export const getData = async (url: string) => {
  const data = {
    text2: '',
    text3: '',
  }

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('get data failed')
  }

  const list: CallData[] = await res.json()
  if (!list.length) {
    return data
  }

  const a = list.find((x) => x.state === 1)
  if (a) {
    data.text2 = `${a.number} ${a.name}`
  }

  const b = list.filter((x) => x.state === 0)
  if (b.length) {
    data.text3 = b
      .slice(0, 2)
      .map((x) => `${x.number} ${x.name}`)
      .join('    ')
  }

  return data
}
