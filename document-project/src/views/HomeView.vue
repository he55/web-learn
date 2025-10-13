<script setup>
import { onMounted, ref, watch } from 'vue'
import markdownit from 'markdown-it'

const p = new URLSearchParams(location.search)
const k = p.get('k')

let listData = []
const list = ref([])
const selectedItem = ref({})
const searchText = ref('')
const doc_records = ref([])
const selectedDoc = ref('')

const md = markdownit()
const html = ref('')

const dateFormat = (time) => {
  if (!time) {
    return ''
  }
  return time.slice(0, 19).replace('T', ' ')
}

const loadData = async () => {
  const res = await fetch(`/medical/api/subsequentvisit/getvalue?id=${k}&token=qwe123asd`)
  listData = await res.json()
  list.value = listData
}
const loadDocRecords = async (pid) => {
  const res = await fetch(`/medical/api/subsequentvisit/getresult2list?pid=${pid}&token=qwe123asd`)
  const list = await res.json()
  return list
}
const loadDoc = async (id) => {
  const res = await fetch(`/medical/api/subsequentvisit/getresult2byid?id=${id}&token=qwe123asd`)
  if (res.status === 200) {
    const data = await res.json()
    html.value = md.render(data.error || data.content)
  } else if (res.status === 500) {
    const err = await res.text()
    html.value = `<h2>${err}</h2>`
  } else {
    alert('请求失败，请稍后重试')
  }
}
const regen = async (pid) => {
  const res = await fetch(`/medical/api/subsequentvisit/createtask2?pid=${pid}&token=qwe123asd`, {
    method: 'POST',
  })
  if (res.status === 200) {
    alert('正在生成结果，请稍后查看内容')
  } else {
    alert('请求失败，请稍后重试')
  }
}
const reload = () => {
  location.reload()
}
const itemClick = async (item) => {
  html.value = ''
  selectedDoc.value = ''
  selectedItem.value = item
  const list = await loadDocRecords(item.PatientNumber)
  doc_records.value = list
  if (list.length) {
    selectedDoc.value = list[0].id
  }
}

watch(searchText, (str) => {
  if (str) {
    list.value = listData.filter((x) => x.Name.includes(str))
  } else {
    list.value = listData
  }
})
watch(selectedDoc, (val) => {
  if (val) {
    loadDoc(val)
  }
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="container">
    <nav>
      <div class="title">
        <p>病人列表</p>
        <button class="reload" @click="reload">刷新</button>
      </div>
      <input type="search" v-model="searchText" placeholder="搜索" class="search" />
      <ul class="persons">
        <li
          @click="itemClick(item)"
          :class="{ active: selectedItem === item, green: item.LastCreateTime }"
          v-for="item in list"
          :key="item.Id"
        >
          <p>
            <strong>{{ item.Name }}</strong>
          </p>
          <p>
            <span>{{ item.ActiveStateName }}</span> <span>{{ item.VisitTypeName }}</span>
          </p>
          <p>{{ dateFormat(item.LastConsumptionTime) }}</p>
        </li>
      </ul>
    </nav>
    <header>
      <table>
        <tbody>
          <tr>
            <td><strong>姓名：</strong>{{ selectedItem.Name }}</td>
            <td><strong>就诊卡号：</strong>{{ selectedItem.HospitalNumber }}</td>
            <td><strong>复诊类型：</strong>{{ selectedItem.VisitTypeName }}</td>
          </tr>
          <tr>
            <td><strong>科室：</strong>{{ selectedItem.DepartmentName }}</td>
            <td><strong>医生：</strong>{{ selectedItem.DoctorName }}</td>
            <td><strong>医助：</strong>{{ selectedItem.AssistDoctorName }}</td>
          </tr>
          <tr>
            <td><strong>来院情况：</strong>{{ selectedItem.Description }}</td>
            <td><strong>活跃状态：</strong>{{ selectedItem.ActiveStateName }}</td>
            <td><strong>备注：</strong>{{ selectedItem.Remarks }}</td>
          </tr>
        </tbody>
      </table>
    </header>
    <main>
      <div v-show="selectedItem.PatientNumber">
        <button class="regen" @click="regen(selectedItem.PatientNumber)">重新生成</button>
        <select class="doc-select" v-model="selectedDoc">
          <option value="" disabled>-- 请选择记录 --</option>
          <option :value="item.id" v-for="item in doc_records" :key="item.id">
            {{ dateFormat(item.createTime) }}
          </option>
        </select>
      </div>
      <div class="markdown" v-html="html"></div>
    </main>
  </div>
</template>

<style scoped>
.container {
  box-sizing: border-box;
  height: 100%;
  padding: 10px;
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: auto 1fr;
  gap: 10px;
  background-color: #f2f3f5;
}
nav {
  grid-row: 1/3;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;

  .title {
    display: flex;
    justify-content: space-between;
  }
  .reload {
    padding: 2px 8px;
  }
  .search {
    padding: 2px;
  }
  .persons {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 5px;
    list-style-type: none;

    li {
      padding: 5px;
      border-radius: 10px;
      background-color: #f2f3f5;
    }
    li.active {
      color: #1e80ff;
      background-color: #eaf2ff;
    }
    li:hover {
      color: #1e80ff;
    }
    .green {
      color: green;
    }
  }
}
header {
  padding: 10px 15px;
  font-size: 18px;
  align-content: center;
  background-color: white;
  border-radius: 10px;
}
main {
  overflow: auto;
  padding: 10px 25px;
  flex: 1;
  background-color: white;
  border-radius: 10px;
}
.regen {
  padding: 2px 8px;
}
.doc-select {
  width: 170px;
  margin-left: 10px;
  padding: 2px 8px;
}
table {
  width: 100%;
  table-layout: fixed;
}

.markdown * {
  margin: 5px 0;
}
.markdown :deep(table) {
  border-collapse: collapse;

  th,
  td {
    border: 1px solid #d0d7dd;
    padding: 8px 10px;
  }

  tbody > tr:nth-of-type(even) {
    background-color: #f6f8fa;
  }
}
</style>
