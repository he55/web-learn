<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as api from '@/api'

const date = ref('')
const dict = ref({})

const dateFormat = (date) => {
  const a = date.toLocaleDateString()
  const day = date.getDay()
  const dayNames = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const dayName = dayNames[day]
  return `${a} ${dayName}`
}

const loadData = async () => {
  date.value = dateFormat(new Date())
  const res = await api.getInpatientDashboard()
  if (res.status !== 200) {
    return
  }
  dict.value = await res.json()
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
      <thead>
        <tr>
          <td colspan="12" class="table-title">{{ dict['医院名称'] }}</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="2">日期</td>
          <td>入院</td>
          <td colspan="2">出院</td>
          <td colspan="2">手术</td>
          <td colspan="3">危重</td>
          <td>值班医生</td>
          <td class="cell">{{ dict['值班医生'] }}</td>
        </tr>
        <tr>
          <td colspan="2" class="cell">{{ date }}</td>
          <td rowspan="5" class="cell">{{ dict['入院'] }}</td>
          <td>今日</td>
          <td>明日</td>
          <td>今日</td>
          <td>明日</td>
          <td>病危</td>
          <td>病重</td>
          <td>一级护理</td>
          <td>夜班护士</td>
          <td class="cell">{{ dict['夜班护士'] }}</td>
        </tr>
        <tr>
          <td colspan="2">人数</td>
          <td rowspan="4" class="cell">{{ dict['出院:今日'] }}</td>
          <td rowspan="4" class="cell">{{ dict['出院:明日'] }}</td>
          <td rowspan="4" class="cell">{{ dict['手术:今日'] }}</td>
          <td rowspan="4" class="cell">{{ dict['手术:明日'] }}</td>
          <td rowspan="4" class="cell">{{ dict['危重:病危'] }}</td>
          <td rowspan="4" class="cell">{{ dict['危重:病重'] }}</td>
          <td rowspan="4" class="cell">{{ dict['危重:一级护理'] }}</td>
          <td>办公护士</td>
          <td class="cell">{{ dict['办公护士'] }}</td>
        </tr>
        <tr>
          <td>原有</td>
          <td>现有</td>
          <td>责总护士</td>
          <td class="cell">{{ dict['责总护士'] }}</td>
        </tr>
        <tr>
          <td rowspan="2" class="cell">{{ dict['人数:原有'] }}</td>
          <td rowspan="2" class="cell">{{ dict['人数:现有'] }}</td>
          <td>责1护士</td>
          <td class="cell">{{ dict['责1护士'] }}</td>
        </tr>
        <tr>
          <td>责2护士</td>
          <td class="cell">{{ dict['责2护士'] }}</td>
        </tr>
        <tr>
          <td rowspan="4">血压监测</td>
          <td>Bid</td>
          <td colspan="3" class="cell">{{ dict['血压监测:Bid'] }}</td>
          <td rowspan="6">血糖监测</td>
          <td colspan="2" rowspan="6" class="cell">{{ dict['血糖监测'] }}</td>
          <td rowspan="2">明日抽血</td>
          <td colspan="3" rowspan="2" class="cell">{{ dict['明日抽血'] }}</td>
        </tr>
        <tr>
          <td>Tid</td>
          <td colspan="3" class="cell">{{ dict['血压监测:Tid'] }}</td>
        </tr>
        <tr>
          <td>Q6h</td>
          <td colspan="3" class="cell">{{ dict['血压监测:Q6h'] }}</td>
          <td rowspan="2">吸氧</td>
          <td colspan="3" rowspan="2" class="cell">{{ dict['吸氧'] }}</td>
        </tr>
        <tr>
          <td>Q8h</td>
          <td colspan="3" class="cell">{{ dict['血压监测:Q8h'] }}</td>
        </tr>
        <tr>
          <td>防跌倒坠床</td>
          <td colspan="4" class="cell">{{ dict['防跌倒坠床'] }}</td>
          <td rowspan="2">冰敷</td>
          <td colspan="3" rowspan="2" class="cell">{{ dict['冰敷'] }}</td>
        </tr>
        <tr>
          <td>防压疮</td>
          <td colspan="4" class="cell">{{ dict['防压疮'] }}</td>
        </tr>
        <tr>
          <td>24h出入量</td>
          <td colspan="3" class="cell">{{ dict['24h出入量'] }}</td>
          <td>引流 (VSD)</td>
          <td colspan="3" class="cell">{{ dict['引流 (VSD)'] }}</td>
          <td>转床</td>
          <td colspan="3" class="cell">{{ dict['转床'] }}</td>
        </tr>
        <tr>
          <td>换药</td>
          <td colspan="3" class="cell">{{ dict['换药'] }}</td>
          <td>引流 (伤口)</td>
          <td colspan="3" class="cell">{{ dict['引流 (伤口)'] }}</td>
          <td>转入</td>
          <td colspan="3" class="cell">{{ dict['转入'] }}</td>
        </tr>
        <tr>
          <td>药物过敏</td>
          <td colspan="3" class="cell">{{ dict['药物过敏'] }}</td>
          <td>明日转监护</td>
          <td colspan="3" class="cell">{{ dict['明日转监护'] }}</td>
          <td>转出</td>
          <td colspan="3" class="cell">{{ dict['转出'] }}</td>
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
}
</style>
