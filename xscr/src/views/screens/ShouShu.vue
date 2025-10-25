<script setup lang="ts">
import { getList } from '@/api'
import type { DataItem } from '@/types'
import { getNowString, nameFix, statusFormat } from '@/utils'
import { onMounted, onUnmounted, ref } from 'vue'

const time = ref('')
const list = ref<DataItem[]>([])

const loadData = async () => {
  time.value = getNowString()
  try {
    list.value = await getList('0')
  } catch {}
}

let timeInterval: number
onMounted(() => {
  loadData()

  timeInterval = setInterval(loadData, 15_000)
})
onUnmounted(() => {
  clearInterval(timeInterval)
})
</script>

<template>
  <div class="container">
    <header>
      <div class="logo">郑州痛风风湿病医院</div>
      <div class="title">家属等待区</div>
      <div class="time">{{ time }}</div>
    </header>
    <main>
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>手术医生</th>
            <th>病人姓名</th>
            <th>麻醉方式</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.doctor }}</td>
            <td>{{ nameFix(item.patient) }}</td>
            <td>{{ item.method }}</td>
            <td :style="{ color: item.status === 0 ? '#3498db' : 'red' }" style="font-weight: bold">
              {{ statusFormat(item.status) }}
            </td>
          </tr>
        </tbody>
      </table>
    </main>
    <footer>温馨提示：请保持安静，耐心等待</footer>
  </div>
</template>

<style scoped>
.container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  padding: 10px 60px;
  color: white;
  background-color: rgb(5 9 25);
}
header {
  display: flex;
  align-items: flex-end;
  padding: 0 15px;

  div {
    flex: 1;
  }
  .logo {
    font-size: 40px;
  }
  .title {
    font-size: 60px;
    text-align: center;
  }
  .time {
    font-size: 35px;
    text-align: end;
  }
}
main {
  flex: 1;
  background-color: rgb(29 57 71);
}
table {
  width: 100%;
  font-size: 40px;
  text-align: center;
}
thead {
  background-color: rgb(17 107 108);
}
tbody {
  background-color: rgb(29 57 71);
  border-spacing: 0;
}
tbody > tr:nth-child(even) {
  background-color: rgb(24 90 115);
}
footer {
  font-size: 30px;
  text-align: center;
}
</style>
