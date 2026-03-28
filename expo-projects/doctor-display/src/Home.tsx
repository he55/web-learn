import { useEffect, useState } from 'react'
import { Image, Modal, Platform, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import Settings from './Settings'
import { getData, getConfig, loadConfig, type Config } from './utils'

const bgImg = require('../assets/bg.jpg')

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false)

  const [label1Text, setLabel1Text] = useState('')
  const [label2Text, setLabel2Text] = useState('')
  const [names, setNames] = useState<string[]>([])

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
          setLabel2Text(data.title)
          setNames(data.names)
        }
      } catch (error) {
        console.log(error)
        setLabel2Text('')
        setNames([])
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

        <Text style={[styles.text, styles.label1]}>{label1Text}</Text>

        <Text style={[styles.text, styles.label2]} onPress={() => setModalVisible(true)}>
          {label2Text}
        </Text>

        <View style={[styles.text, styles.nameView]}>
          {names.map((name) => (
            <Text key={name} style={styles.nameItem}>
              {name}
            </Text>
          ))}
        </View>
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
    position: 'absolute',
    textAlign: 'center',
    // backgroundColor: '#00ff004f',
  },
  label1: {
    left: 260,
    bottom: 0,
    width: 200,
    height: 28,
    fontSize: 15,
    lineHeight: 28,
  },
  label2: {
    color: '#00908e',
    left: 155,
    bottom: 578,
    width: 520,
    height: 78,
    fontSize: 50,
    fontWeight: 'bold',
    lineHeight: 78,
  },
  nameView: {
    position: 'absolute',
    left: 156,
    bottom: 348,
    width: 520,
    height: 200,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  nameItem: {
    width: '33%',
    height: '25%',
    fontSize: 30,
    textAlign: 'center',
    lineHeight: 50,
    // borderWidth: 1,
  },
})
