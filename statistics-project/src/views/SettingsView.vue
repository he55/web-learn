<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const dict = ref({})

const loadData = async () => {
  const res = await fetch(import.meta.env.VITE_API_URL + '/api/dashboard/getsettings')
  dict.value = await res.json()
}
const saveSettings = async () => {
  const res = await fetch(import.meta.env.VITE_API_URL + '/api/dashboard/savesettings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dict.value),
  })
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
      <button @click="gotoHome">返回主页</button>
      <br /><br />
    </div>
    <div class="table">
      <div class="item" v-for="(v, k) in dict" :key="k">
        <label>{{ k }}</label>
        <textarea v-model="dict[k]" :name="k"></textarea>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  overflow-y: auto;
}
.btn-group {
  position: fixed;
  left: 500px;

  button {
    padding: 2px 10px;
  }
}
.table {
  display: table;
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
