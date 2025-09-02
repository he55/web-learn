<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as api from '@/api'

const router = useRouter()
const dict = ref({})

const loadData = async () => {
  const res = await api.getSettings()
  if (res.status !== 200) {
    return
  }
  dict.value = await res.json()
}
const saveSettings = async () => {
  const res = await api.saveSettings(dict.value)
  alert(res.status === 200 ? '保存成功' : '保存失败，请重试')
}
const gotoHome = () => {
  router.push('/')
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="container">
    <div class="btn-group">
      <button @click="saveSettings">保存</button> &nbsp;
      <button @click="gotoHome" style="display: none">返回主页</button>
    </div>
    <div class="table">
      <div class="item" v-for="(v, k) in dict" :key="k">
        <label>{{ k }}</label>
        <textarea v-model="dict[k]" :name="k"></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  overflow-y: auto;
  padding: 0 5px;
}
.btn-group {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: white;

  button {
    padding: 2px 10px;
    font-size: 20px;
  }
}
.table {
  display: table;
  margin-top: 60px;
}
.item {
  display: table-row;
}
label,
textarea {
  display: table-cell;
}
label {
  vertical-align: top;
}
textarea {
  width: 300px;
  height: 60px;
  margin-bottom: 20px;
  margin-left: 10px;
  padding: 2px;
  font-size: 16px;
}
</style>
