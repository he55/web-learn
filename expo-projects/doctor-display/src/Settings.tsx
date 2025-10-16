import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

type PropsType = {
  onClose(): void;
};

export default function Settings({ onClose }: PropsType) {
  const defaultValue = "http://172.16.4.2:8081/1/asset.json";
  const [url, setUrl] = useState("");

  const loadSettings = async () => {
    const val = await AsyncStorage.getItem("url");
    setUrl(val ?? defaultValue);
    console.log("loadSettings()", val);
  };
  const saveSettings = async () => {
    if (!url) {
      Alert.alert("错误", "无效地址");
      return;
    }
    await AsyncStorage.setItem("url", url);
    onClose();
  };

  const reset = () => {
    setUrl(defaultValue);
  };

  useEffect(() => {
    loadSettings();
  }, []);

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
        <View style={styles.buttonView}>
          <View style={{ marginRight: "auto" }}>
            <Button title="Reset" onPress={reset} />
          </View>
          <Button title="取消" onPress={onClose} />
          <Button title="保存" onPress={saveSettings} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    marginVertical: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    fontSize: 18,
    borderWidth: 1,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 15,
  },
});
