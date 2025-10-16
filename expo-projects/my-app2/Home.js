import { useEffect, useState } from 'react'
import {
  ImageBackground,
  Modal,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native'
import Settings from './Settings'
import { getData, getConfig } from './utils'

const bgImg = require('./assets/bg.jpg')

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false)
  const [label1Text, setLabel1Text] = useState('')
  const [label2Text, setLabel2Text] = useState('')
  const [label3Text, setLabel3Text] = useState('')

  useEffect(() => {
    let config
    let timeoutId
    let timeoutId2

    const getConfigTick = async () => {
      console.log(new Date(), 'getConfig')
      try {
        config = await getConfig()
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
      <ImageBackground source={bgImg} style={styles.img}>
        <View style={styles.container}>
          <Text style={[styles.text, styles.label1]}>肌骨超声1</Text>
          <Text style={[styles.text, styles.text1]}>张山</Text>
          <Text style={[styles.text, styles.label2]}>肌骨超声2</Text>
          <Text style={[styles.text, styles.text2]}>里斯</Text>

          <Text style={[styles.text, styles.text3]} onPress={() => setModalVisible(true)}>
            王小明
          </Text>
        </View>
      </ImageBackground>
    </>
  )
}

const styles = StyleSheet.create({
  img: {
    flex: 1,
  },
  container: {
    paddingTop: 325,
    paddingHorizontal: 125,
  },
  text: {
    alignContent: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    // backgroundColor: 'green',
    // opacity: 0.5,
  },
  label1: {
    height: 85,
  },
  text1: {
    height: 140,
    marginTop: 5,
    fontSize: 70,
  },
  label2: {
    height: 85,
    marginTop: 20,
  },
  text2: {
    height: 140,
    marginTop: 5,
    fontSize: 70,
  },
  text3: {
    height: 820,
    marginTop: 185,
    alignContent: 'flex-start',
  },
})
