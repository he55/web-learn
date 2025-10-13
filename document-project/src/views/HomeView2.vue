<script setup>
import { onMounted, ref, watch } from 'vue'
import markdownit from 'markdown-it'

const p = new URLSearchParams(location.search)

const patient_id = p.get('patient_id') ?? ''
const org = p.get('org') ?? ''
const t = p.get('t') ?? ''

const selectedItem = ref({})
const doc_records = ref([])
const selectedDoc = ref('')

const md = markdownit({ html: true })
const html = ref('')

const dateFormat = (time) => {
  if (!time) {
    return ''
  }
  return time.slice(0, 19).replace('T', ' ')
}

const statusFormat = (val) => {
  if (val === undefined) {
    return ''
  }
  return val ? '已生成' : '正在生成'
}

const _url = (src = '') => {
  const s = src.includes('?') ? '&' : '?'
  return `/bsfx${src}${s}org=${org}&token=${t}`
}

const loadData = async () => {
  const res = await fetch(_url(`/api/document/getdata?patient_id=${patient_id}`))
  if (!res.ok) {
    alert('发送请求失败')
    return
  }
  const data = await res.json()
  if (!data) {
    html.value = '<h2>没有生成回访内容</h2>'
    return
  }

  selectedItem.value = data
  const list = data.records
  doc_records.value = list
  if (list.length) {
    selectedDoc.value = list[0].id
  }
}

const loadDoc = async (id) => {
  const res = await fetch(_url(`/api/document/getresult2byid?id=${id}`))
  if (res.status === 200) {
    const data = await res.json()
    html.value = md.render(data.output)
  } else if (res.status === 500) {
    const err = await res.text()
    html.value = `<h2>${err}</h2>`
  } else {
    alert('请求失败，请稍后重试')
  }
}

const reload = () => {
  location.reload()
}

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
    <header>
      <table>
        <tbody>
          <tr>
            <td><strong>姓名：</strong>{{ selectedItem.patient_name }}</td>
            <td><strong>状态：</strong>{{ statusFormat(selectedItem.is_done) }}</td>
            <td><strong>创建时间：</strong>{{ dateFormat(selectedItem.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </header>
    <main>
      <div>
        <button class="reload" @click="reload">刷新</button>
        <select class="doc-select" v-model="selectedDoc">
          <option value="" disabled>-- 请选择记录 --</option>
          <option :value="item.id" v-for="item in doc_records" :key="item.id">
            {{ dateFormat(item.created_at) }}
          </option>
        </select>
      </div>
      <div class="markdown-content" v-html="html"></div>
    </main>
  </div>
</template>

<style scoped>
.container {
  box-sizing: border-box;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f2f3f5;
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
.reload {
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
</style>

<style>
/* Markdown样式优化 */
.markdown-content {
  padding: 20px;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  color: #2c3e50;
  margin: 25px 0 15px 0;
  font-weight: 600;
  line-height: 1.4;
}

.markdown-content h1 {
  font-size: 2.2em;
  border-bottom: 4px solid #667eea;
  padding-bottom: 15px;
  margin-top: 0;
  color: #2c3e50;
  font-weight: 700;
}

.markdown-content h2 {
  font-size: 1.8em;
  border-bottom: 3px solid #ddd;
  padding-bottom: 12px;
  color: #34495e;
  font-weight: 600;
  margin-top: 30px;
}

.markdown-content h3 {
  font-size: 1.5em;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(102, 126, 234, 0.3);
}

.markdown-content h4 {
  font-size: 1.2em;
  color: #555;
  border-left: 4px solid #667eea;
  padding-left: 15px;
}

.markdown-content p {
  margin: 18px 0;
  text-align: justify;
  text-indent: 2em;
  line-height: 1.8;
  color: #2c3e50;
}

.markdown-content ul,
.markdown-content ol {
  margin: 20px 0;
  padding-left: 35px;
}

.markdown-content li {
  margin: 12px 0;
  line-height: 1.7;
  color: #34495e;
}

.markdown-content ul li {
  list-style-type: disc;
  color: #555;
}

.markdown-content ol li {
  list-style-type: decimal;
  color: #555;
}

.markdown-content em {
  color: #3498db;
  font-style: italic;
  background: linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%);
  padding: 3px 8px;
  border-radius: 4px;
  border-left: 3px solid #3498db;
}

.markdown-content code {
  background: #f8f9fa;
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'Courier New', 'Monaco', monospace;
  color: #e74c3c;
  border: 1px solid #e9ecef;
  font-size: 0.9em;
}

.markdown-content pre {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #ecf0f1;
  padding: 20px;
  border-radius: 10px;
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid #34495e;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.markdown-content pre code {
  background: none;
  color: inherit;
  padding: 0;
  border: none;
}

.markdown-content blockquote {
  border-left: 5px solid #667eea;
  margin: 20px 0;
  padding: 15px 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #555;
  border-radius: 0 8px 8px 0;
  font-style: italic;
}

.markdown-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.markdown-content th,
.markdown-content td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  text-align: left;
  vertical-align: top;
}

.markdown-content th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9em;
  letter-spacing: 0.5px;
}

.markdown-content tr:nth-child(even) {
  background: #f8f9fa;
}

.markdown-content tr:hover {
  background: #e3f2fd;
}

.markdown-content hr {
  border: none;
  border-top: 3px solid #ddd;
  margin: 30px 0;
  border-radius: 2px;
}

/* 特殊样式 */
.markdown-content .highlight {
  background: linear-gradient(120deg, #fff3cd 0%, transparent 100%);
  padding: 10px 15px;
  border-radius: 5px;
  border-left: 4px solid #ffc107;
}

.markdown-content .warning {
  background: linear-gradient(120deg, #f8d7da 0%, transparent 100%);
  padding: 10px 15px;
  border-radius: 5px;
  border-left: 4px solid #dc3545;
}

.markdown-content .info {
  background: linear-gradient(120deg, #d1ecf1 0%, transparent 100%);
  padding: 10px 15px;
  border-radius: 5px;
  border-left: 4px solid #17a2b8;
}
</style>
