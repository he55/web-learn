<script setup>
import { onMounted, ref } from 'vue'
import markdownit from 'markdown-it'

const md = markdownit()
const doc = ref({})
const html = ref('')

const loadData = async () => {
  const res = await fetch('/data.json')
  const data = await res.json()
  doc.value = data
  html.value = md.render(data.output)
}
const reload = () => {
  location.reload()
}
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
      <input type="search" placeholder="搜索" class="search" />
      <div class="persons-wrapper">
        <ul class="persons">
          <li>12345</li>
          <li>12345</li>
          <li class="active">12345</li>
          <li>12345</li>
          <li>12345</li>
          <li>12345</li>
          <li>12345</li>
          <li>12345</li>
          <li>12345</li>
          <li>12345</li>
        </ul>
      </div>
    </nav>
    <header>
      <p>
        <strong>姓名：</strong>{{ doc.patient_name }} &nbsp;&nbsp;&nbsp;&nbsp;
        <strong>病人编号：</strong>{{ doc.patient_id }} &nbsp;&nbsp;&nbsp;&nbsp;
        <strong>创建时间：</strong>{{ doc.created_at?.slice(0, 19).replace('T', ' ') }}
      </p>
    </header>
    <main>
      <div class="markdown" v-html="html"></div>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
.container {
  height: 100%;
  padding: 10px;
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr;
  gap: 10px;
  background-color: #f2f3f5;
}
nav {
  grid-row: 1/3;

  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 200px;
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
  .persons-wrapper {
    overflow-y: auto;
  }
  .persons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 5px;
    list-style-type: none;

    li {
      height: 100px;
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
  }
}
header {
  padding: 10px 15px;
  font-size: 20px;
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
