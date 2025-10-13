<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as api from '@/api'

const date = ref('')
const dict = ref({})
const data1 = ref(new Array(10).fill({ key: ' ', value: ' ' }))
const data2 = ref(new Array(10).fill({ key: ' ', value: ' ' }))

const dateFormat = (date) => {
  const a = date.toLocaleDateString()
  const day = date.getDay()
  const dayNames = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const dayName = dayNames[day]
  return `${a} ${dayName}`
}

const fdata = (val) => {
  const arr = new Array(10).fill({ key: ' ', value: ' ' })

  if (!val) {
    return arr
  }

  const lines = val.split('\n')
  if (lines.length === 0) {
    return arr
  }

  for (let i = 0; i < lines.length; i++) {
    const str = lines[i]
    if (!str) {
      arr[i] = { key: '', value: '' }
    }

    const index = str.indexOf('=')
    if (index == -1) {
      arr[i] = { key: str, value: '' }
    }
    arr[i] = { key: str.substring(0, index), value: str.substring(index + 1) }
  }

  return arr
}

const loadData = async () => {
  date.value = dateFormat(new Date())
  const res = await api.getInpatientDashboard()
  if (res.status !== 200) {
    return
  }
  const data = await res.json()
  dict.value = data
  data1.value = fdata(data['手术:今日'])
  data2.value = fdata(data['手术:明日'])
}

let intervalId = null
onMounted(() => {
  intervalId = setInterval(loadData, 10_000)
  loadData()
})
onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <div class="container">
    <nav>
      <RouterLink to="/settings" class="link">编辑数据</RouterLink>
    </nav>
    <table>
      <tbody>
        <tr>
          <td colspan="11" class="table-title">{{ dict['医院名称'] }}</td>
        </tr>
        <tr>
          <td colspan="2">日期</td>
          <td>入院</td>
          <td colspan="2">出院</td>
          <td colspan="4">手术</td>
          <td>值班医生</td>
          <td class="cell">{{ dict['值班医生'] }}</td>
        </tr>
        <tr>
          <td colspan="2" class="cell">{{ date }}</td>
          <td rowspan="6">&nbsp;</td>
          <td>今日</td>
          <td>明日</td>
          <td colspan="2">今日</td>
          <td colspan="2">明日</td>
          <td>主班护士</td>
          <td class="cell">{{ dict['主班护士'] }}</td>
        </tr>
        <tr>
          <td colspan="2">人数</td>
          <td rowspan="5" class="cell">{{ dict['出院:今日'] }}</td>
          <td rowspan="5" class="cell">{{ dict['出院:明日'] }}</td>
          <td>床号</td>
          <td>麻醉方式</td>
          <td>床号</td>
          <td>麻醉方式</td>
          <td>责1护士</td>
          <td class="cell">{{ dict['责1护士'] }}</td>
        </tr>
        <tr>
          <td>原有</td>
          <td>现有</td>
          <td class="cell">{{ data1[0].key }}</td>
          <td class="cell">{{ data1[0].value }}</td>
          <td class="cell">{{ data2[0].key }}</td>
          <td class="cell">{{ data2[0].value }}</td>
          <td>责2护士</td>
          <td class="cell">{{ dict['责2护士'] }}</td>
        </tr>
        <tr>
          <td rowspan="3" class="cell">{{ dict['人数:原有'] }}</td>
          <td rowspan="3" class="cell">{{ dict['人数:现有'] }}</td>
          <td class="cell">{{ data1[1].key }}</td>
          <td class="cell">{{ data1[1].value }}</td>
          <td class="cell">{{ data2[1].key }}</td>
          <td class="cell">{{ data2[1].value }}</td>
          <td>责3护士</td>
          <td class="cell">{{ dict['责3护士'] }}</td>
        </tr>
        <tr>
          <td class="cell">{{ data1[2].key }}</td>
          <td class="cell">{{ data1[2].value }}</td>
          <td class="cell">{{ data2[2].key }}</td>
          <td class="cell">{{ data2[2].value }}</td>
          <td>小夜班</td>
          <td class="cell">{{ dict['小夜班'] }}</td>
        </tr>
        <tr>
          <td class="cell">{{ data1[3].key }}</td>
          <td class="cell">{{ data1[3].value }}</td>
          <td class="cell">{{ data2[3].key }}</td>
          <td class="cell">{{ data2[3].value }}</td>
          <td>大夜班</td>
          <td class="cell">{{ dict['大夜班'] }}</td>
        </tr>
        <tr>
          <td rowspan="3">高血压</td>
          <td colspan="4" rowspan="3" class="cell">{{ dict['高血压'] }}</td>
          <td class="cell">{{ data1[4].key }}</td>
          <td class="cell">{{ data1[4].value }}</td>
          <td class="cell">{{ data2[4].key }}</td>
          <td class="cell">{{ data2[4].value }}</td>
          <td colspan="2" rowspan="2">&nbsp;</td>
        </tr>
        <tr>
          <td class="cell">{{ data1[5].key }}</td>
          <td class="cell">{{ data1[5].value }}</td>
          <td class="cell">{{ data2[5].key }}</td>
          <td class="cell">{{ data2[5].value }}</td>
        </tr>
        <tr>
          <td class="cell">{{ data1[6].key }}</td>
          <td class="cell">{{ data1[6].value }}</td>
          <td class="cell">{{ data2[6].key }}</td>
          <td class="cell">{{ data2[6].value }}</td>
          <td>危重</td>
          <td class="cell">{{ dict['危重'] }}</td>
        </tr>
        <tr>
          <td rowspan="4">高血糖</td>
          <td colspan="2">特殊</td>
          <td colspan="2" class="cell">{{ dict['高血压:特殊'] }}</td>
          <td class="cell">{{ data1[7].key }}</td>
          <td class="cell">{{ data1[7].value }}</td>
          <td class="cell">{{ data2[7].key }}</td>
          <td class="cell">{{ data2[7].value }}</td>
          <td>病重</td>
          <td class="cell">{{ dict['病重'] }}</td>
        </tr>
        <tr>
          <td colspan="2">早空腹+三餐后</td>
          <td colspan="2" class="cell">{{ dict['高血压:早空腹+三餐后'] }}</td>
          <td rowspan="2">肾病</td>
          <td colspan="3" rowspan="2" class="cell">{{ dict['肾病'] }}</td>
          <td rowspan="2">贫血</td>
          <td rowspan="2" class="cell">{{ dict['贫血'] }}</td>
        </tr>
        <tr>
          <td colspan="2">
            早空腹+三餐后 <br />
            +睡前
          </td>
          <td colspan="2" class="cell">{{ dict['高血压:早空腹+三餐后+睡前'] }}</td>
        </tr>
        <tr>
          <td colspan="2">
            早空腹+三餐前 <br />
            +三餐后+睡前
          </td>
          <td colspan="2" class="cell">{{ dict['高血压:早空腹+三餐前+三餐后+睡前'] }}</td>
          <td>心血管疾病</td>
          <td colspan="3" class="cell">{{ dict['心血管疾病'] }}</td>
          <td>危机值</td>
          <td class="cell">{{ dict['危机值'] }}</td>
        </tr>
        <tr>
          <td rowspan="2">高血脂</td>
          <td colspan="4" rowspan="2" class="cell">{{ dict['高血脂'] }}</td>
          <td rowspan="2">消化系统疾病</td>
          <td colspan="3" rowspan="2" class="cell">{{ dict['消化系统疾病'] }}</td>
          <td rowspan="2">特殊</td>
          <td rowspan="2" class="cell">{{ dict['特殊'] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  box-sizing: border-box;
  height: 100%;
  padding: 8px;
}
nav {
  position: fixed;
  right: 15px;
  height: 50px;
  .link {
    visibility: hidden;
  }
  &:hover {
    .link {
      visibility: visible;
    }
  }
}
table {
  width: 100%;
  height: 100%;
  table-layout: fixed;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  border-collapse: collapse;
}
thead {
  font-size: 45px;
  font-weight: bold;
}
thead:hover {
  .btn-edit {
    opacity: 1;
  }
}
td {
  border: 2px solid blue;
}
.cell {
  color: red;
  font-size: 20px;
  font-weight: initial;
  white-space: pre-wrap;
}
.table-title {
  height: 65px;
  font-size: 45px;
  font-weight: bold;
}
</style>
