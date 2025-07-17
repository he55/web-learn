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
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="container">
    <nav><div>123</div></nav>
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
  grid-template-areas:
    'nav header'
    'nav main';
  gap: 10px;
  background-color: rgb(242, 244, 246);
}
nav {
  grid-area: nav;
  width: 200px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
}
header {
  grid-area: header;
  padding: 10px 15px;
  font-size: 20px;
  align-content: center;
  background-color: white;
  border-radius: 10px;
}
main {
  grid-area: main;
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
