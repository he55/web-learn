<script setup lang="ts">
import ToothTable from '@/components/ToothTable.vue'
import markdownit from 'markdown-it'
import { onMounted, provide, ref, watch } from 'vue'
import NewInspect from '@/components/NewInspect.vue'
import * as api from '@/api'
import { formatDateTime } from '@/utils/date'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'

const p = new URLSearchParams(location.search)
const patientIdStr = p.get('patientId')

let patientId = 0
if (patientIdStr) {
  patientId = parseInt(patientIdStr)
}

provide('patientId', patientId)

const md = markdownit()
const html = ref('')

const dialogFormVisible = ref(false)

const reportId = ref<number>()
const checkRecord = ref<api.DentalCheckRecordDto[]>([])

const closeDialog = (needReload?: boolean) => {
  dialogFormVisible.value = false
  if (needReload) {
    // TODO: reload
  }
}

const imgUrl = ref('')
const images = ref<string[]>([])
let imageList: api.CheckImage[] = []
let imageIndex = 0

const setImageList = (data: api.CheckImage[]) => {
  imageIndex = 0
  imageList = data
  images.value = data.map((x) => x.url)

  if (data.length > 0) {
    imgUrl.value = data[0].url
  } else {
    imgUrl.value = ''
  }
}

const switchImage = (mode: 'prev' | 'next') => {
  const len = imageList.length
  if (len === 0) {
    return
  }

  if (mode === 'next') {
    if (imageIndex === len - 1) {
      imageIndex = 0
    } else {
      imageIndex++
    }
  } else {
    if (imageIndex === 0) {
      imageIndex = len - 1
    } else {
      imageIndex--
    }
  }

  imgUrl.value = imageList[imageIndex].url
}

const analyseImage = async () => {
  await api.analyseImage(imageList[imageIndex].imageId, reportId.value!)
  ElNotification({
    title: '提示',
    message: '生成报告需要几分钟，请稍后查看',
    type: 'primary',
  })
}

watch(reportId, async (newVal) => {
  setImageList([])
  html.value = ''

  if (newVal) {
    const imageData = await api.getImageByCheckId(newVal)
    setImageList(imageData)

    const reportData = await api.getAIReport(newVal)
    html.value = md.render(reportData.report)
  }
})

onMounted(async () => {
  const list = await api.getCheckInfo(patientId)
  checkRecord.value = list
  if (list.length > 0) {
    reportId.value = list[0].id
  }
})
</script>

<template>
  <el-dialog v-model="dialogFormVisible" destroy-on-close title="请关联就诊" width="700">
    <NewInspect :diag-id="0" @request-close="closeDialog" />
  </el-dialog>
  <el-container class="content">
    <el-container class="left">
      <el-main>
        <el-container style="height: 100%">
          <el-header height="45px" style="display: flex">
            <el-select v-model="reportId" placeholder="选择检查" style="width: 200px">
              <el-option
                v-for="item in checkRecord"
                :key="item.id"
                :label="formatDateTime(item.regTime)"
                :value="item.id"
              />
            </el-select>
            <el-button
              type="primary"
              @click="analyseImage"
              :disabled="!reportId"
              style="margin-left: 10px"
            >
              AI分析
            </el-button>
            <el-button type="primary" @click="dialogFormVisible = true" style="margin-left: auto">
              新建检查
            </el-button>
          </el-header>
          <el-main style="padding: 0">
            <el-image class="img" fit="contain" :src="imgUrl" :preview-src-list="images" />
          </el-main>
          <el-footer height="25px" style="text-align: center">
            <div>
              <el-button type="primary" @click="switchImage('prev')" :disabled="images.length <= 1">
                <el-icon><ArrowLeftBold /></el-icon> 上一张
              </el-button>
              <el-button type="primary" @click="switchImage('next')" :disabled="images.length <= 1">
                下一张
                <el-icon><ArrowRightBold /></el-icon>
              </el-button>
            </div>
          </el-footer>
        </el-container>
      </el-main>
      <el-footer height="400px">
        <ToothTable :report-id="reportId" />
      </el-footer>
    </el-container>
    <el-aside width="50%">
      <div v-html="html" class="markdown-content"></div>
    </el-aside>
  </el-container>
</template>

<style scoped>
.content {
  height: 100%;
  padding: 5px;
  gap: 5px;
  background-color: rgb(233, 233, 235);
}
.left {
  gap: 5px;
}
.el-main {
  background-color: white;
}
.el-footer {
  padding: 0;
}
.el-aside {
  background-color: white;
}
.img {
  width: 100%;
  height: 98%;
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
