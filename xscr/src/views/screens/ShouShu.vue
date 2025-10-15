<script setup lang="ts">
import { getNowString } from '@/utils'
import { onMounted, onUnmounted, ref } from 'vue'

type DataItem = {
  no: number
  doctor: string
  patient: string
  method: string
  status: string
}

const time = ref('')
const list = ref<DataItem[]>([])

const arr: DataItem[] = []
for (let i = 0; i < 6; i++) {
  arr.push({
    no: i,
    doctor: '刘医生',
    patient: '张晓红',
    method: 'S',
    status: '等待中',
  })
}
list.value = arr

let timeInterval: number
onMounted(() => {
  time.value = getNowString()

  timeInterval = setInterval(() => {
    time.value = getNowString()
  }, 30_000)
})
onUnmounted(() => {
  clearInterval(timeInterval)
})
</script>

<template>
  <div class="container">
    <header>
      <div>logo</div>
      <div>家属等待区</div>
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
          <tr v-for="item in list" :key="item.no">
            <td>{{ item.no }}</td>
            <td>{{ item.doctor }}</td>
            <td>{{ item.patient }}</td>
            <td>{{ item.method }}</td>
            <td>{{ item.status }}</td>
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
  font-size: 50px;
  text-align: center;

  > div {
    flex: 1;
  }
  > .time {
    font-size: 30px;
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
