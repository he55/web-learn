import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'

export default function Settings({ onClose }) {
  const defaultValue = 'http://172.16.4.2:8081/1/asset.json'
  const [url, setUrl] = useState('')

  const loadSettings = async () => {
    const val = await AsyncStorage.getItem('url')
    setUrl(val ?? defaultValue)
    console.log('loadSettings()', val)
  }
  const saveSettings = async () => {
    if (!url) {
      Alert.alert('错误', '无效地址')
      return
    }
    await AsyncStorage.setItem('url', url)
    onClose()
  }

  const reset = () => {
    setUrl(defaultValue)
  }

  useEffect(() => {
    loadSettings()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>设置</Text>
        <TextInput
          style={styles.input}
          onChangeText={setUrl}
          value={url}
          autoFocus={true}
          placeholder="服务器地址"
        />
        <View style={styles.buttonGroup}>
          <TouchableHighlight onPress={reset} style={{ marginRight: 'auto' }}>
            <Text style={styles.button}>Reset</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={onClose}>
            <Text style={styles.button}>取消</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={saveSettings}>
            <Text style={styles.button}>保存</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    padding: 25,
    borderRadius: 20,
    borderWidth: 2,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  input: {
    marginVertical: 20,
    padding: 10,
    fontSize: 38,
    borderWidth: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    columnGap: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontSize: 40,
    backgroundColor: '#ddd',
  },
})
