import { useEffect, useState } from 'react'
import { Image, Modal, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import Settings from './Settings'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false)
  const [label1Text, setLabel1Text] = useState('')
  const [label2Text, setLabel2Text] = useState('')
  const [label3Text, setLabel3Text] = useState('')

  const bgImg = require('./assets/1.jpg')
  const [bgImage, setBgImage] = useState(bgImg)

  const loadImage = async () => {
    const imgUrl = await AsyncStorage.getItem('imgUrl')
    if (imgUrl) {
      setBgImage({ uri: imgUrl })
    }
  }

  const loadConfig = async () => {
    const url = await AsyncStorage.getItem('url')
    if (!url) {
      throw new Error('url为空')
    }

    const res = await fetch(url, { cache: 'no-cache' })
    if (res.status !== 200) {
      throw new Error('获取配置失败')
    }
    const result = await res.json()

    const imgUrl = new URL(result.assets[0], url).href
    const u = new URL(result.data, url)
    const name = new URLSearchParams(u.search).get('dept')

    AsyncStorage.setItem('imgUrl', imgUrl)

    setBgImage({ uri: imgUrl })
    setLabel1Text(name)

    return { api: u.href }
  }

  const loadData = async (url) => {
    const res = await fetch(url)
    if (res.status !== 200) {
      setLabel2Text('')
      setLabel3Text('')
      return
    }
    const result = await res.json()
    if (!result.length) {
      setLabel2Text('')
      setLabel3Text('')
      return
    }

    const a = result.find((x) => x.state === 1)
    if (a) {
      setLabel2Text(`${a.number} ${a.name}`)
    } else {
      setLabel2Text('')
    }

    const b = result.filter((x) => x.state === 0)
    if (b.length) {
      let str = `${b[0].number} ${b[0].name}`
      if (b.length > 1) {
        str += `  ${b[1].number} ${b[1].name}`
      }
      setLabel3Text(str)
    } else {
      setLabel3Text('')
    }
  }

  useEffect(() => {
    loadImage()

    console.log('onTick')
    let timeoutId
    const onTick = async () => {
      console.log(Date(), 'loadData')
      try {
        const config = await loadConfig()
        await loadData(config.api)
      } catch (error) {
        setLabel2Text('')
        setLabel3Text('')

        ToastAndroid.show('发送请求错误', ToastAndroid.LONG)
        console.log(error)
      }
      timeoutId = setTimeout(onTick, 5_000)
    }
    onTick()
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <>
      <Modal visible={modalVisible}>
        <Settings
          onClose={() => {
            setModalVisible(false)
          }}
        />
      </Modal>
      <View style={styles.container}>
        <Image style={styles.bg} source={bgImage} />
        <Text style={[styles.text, styles.label1]} onPress={() => setModalVisible(true)}>
          {label1Text}
        </Text>
        <Text style={[styles.text, styles.label2]}>{label2Text}</Text>
        <Text style={[styles.text, styles.label3]}>{label3Text}</Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  text: {
    width: 480,
    height: 85,
    position: 'absolute',
    left: 190,
    fontSize: 45,
    fontWeight: 'bold',
    lineHeight: 85,
    textAlign: 'center',
    // backgroundColor:'green',
  },
  label1: {
    bottom: 265,
  },
  label2: {
    bottom: 160,
  },
  label3: {
    bottom: 55,
  },
})
