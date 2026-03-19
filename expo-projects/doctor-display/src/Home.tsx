import { useEffect, useState } from 'react'
import { Image, Modal, Platform, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import Settings from './Settings'
import { getData, getConfig, loadConfig, type Config } from './utils'

const bgImg = require('../assets/bg.jpg')

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false)
  const [label1Text, setLabel1Text] = useState('')
  const [label2Text, setLabel2Text] = useState('')
  const [label3Text, setLabel3Text] = useState('')

  const [bgImage, setBgImage] = useState(bgImg)

  const setup = async () => {
    try {
      const config = await loadConfig()
      if (config) {
        setBgImage({ uri: config.backgroundImageUrl ?? '' })
        setLabel1Text(config.name ?? '')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateUI = (config: Config) => {
    if (bgImage !== config.backgroundImageUrl) {
      setBgImage({ uri: config.backgroundImageUrl })
    }

    if (label1Text !== config.name) {
      setLabel1Text(config.name)
    }
  }

  useEffect(() => {
    setup()

    let config: Config
    let timeoutId: NodeJS.Timeout
    let timeoutId2: NodeJS.Timeout

    const getConfigTick = async () => {
      console.log(new Date(), 'getConfig')
      try {
        config = await getConfig()
        updateUI(config)
      } catch (error) {
        console.log(error)
        if (Platform.OS === 'android') {
          ToastAndroid.show('发送请求失败', ToastAndroid.LONG)
        }
      }
      timeoutId2 = setTimeout(getConfigTick, 30_000)
    }
    getConfigTick()

    const getDataTick = async () => {
      console.log(new Date(), 'getData')
      try {
        if (config) {
          const data = await getData(config.dataUrl)
          setLabel2Text(data.text2)
          setLabel3Text(data.text3)
        }
      } catch (error) {
        console.log(error)
        setLabel2Text('')
        setLabel3Text('')
      }
      timeoutId = setTimeout(getDataTick, 5_000)
    }
    getDataTick()

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(timeoutId2)
    }
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
    width: 490,
    height: 85,
    position: 'absolute',
    left: 190,
    fontSize: 50,
    fontWeight: 'bold',
    lineHeight: 85,
    textAlign: 'center',
    // backgroundColor: 'green',
  },
  label1: {
    bottom: 538,
  },
  label2: {
    bottom: 415,
  },
  label3: {
    bottom: 66,
    height: 308,
    lineHeight: 75,
  },
})
