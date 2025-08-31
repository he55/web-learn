<script setup lang="ts">
import { nextTick, onMounted, reactive, shallowRef, useTemplateRef, watch } from 'vue'
import * as api from '@/api'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

type CustomDiagItem = {
  id: number
  value: string
}

const emit = defineEmits<{
  done: []
}>()

const { diagId } = defineProps<{
  diagId: number
}>()

const tableRef = useTemplateRef('tableRef')

const customDiagList = reactive<CustomDiagItem[]>([])
let listData: api.ICDDiagItem[]
const tableData = shallowRef<api.ICDDiagItem[]>([])

const search = shallowRef('')
const filter = shallowRef(0)

let selecteds: api.ICDDiagItem[]
const handleSelectionChange = (val: api.ICDDiagItem[]) => {
  selecteds = val
}

const addCustomItem = () => {
  customDiagList.push({
    id: Date.now(),
    value: '',
  })
}
const removeCustomItem = (item: CustomDiagItem) => {
  const index = customDiagList.indexOf(item)
  if (index !== -1) {
    customDiagList.splice(index, 1)
  }
}

const save = async () => {
  await api.updatePersonICDInfo(diagId, selecteds)
  ElMessage.success('保存成功')
  emit('done')
}

const setSelection = (items: api.ICDDiagItem[]) => {
  nextTick(() => {
    items.forEach((x) => {
      tableRef.value!.toggleRowSelection(x, true)
    })
  })
}

watch(search, (newVal) => {
  const items = [...selecteds]
  if (newVal) {
    tableData.value = listData.filter((x) => x.name.includes(newVal))
  } else {
    tableData.value = listData
  }
  setSelection(items)
})

watch(filter, (newVal) => {
  const items = [...selecteds]
  if (newVal === 1) {
    tableData.value = selecteds
  } else {
    tableData.value = listData
  }
  setSelection(items)
})

onMounted(async () => {
  listData = await api.getPersonICDInfo(diagId)
  tableData.value = listData

  const items = listData.filter((x) => x.selected)
  setSelection(items)
})
</script>

<template>
  <div class="toolbar">
    <el-input v-model="search" placeholder="搜索诊断" />
    <el-radio-group v-model="filter">
      <el-radio-button label="全部" :value="0" />
      <el-radio-button label="已选" :value="1" />
    </el-radio-group>
    <el-button @click="addCustomItem">添加自定义诊断</el-button>
  </div>

  <div v-if="customDiagList.length">
    <p style="margin-bottom: 5px">自定义诊断</p>
    <div class="custom-input" v-for="item in customDiagList" :key="item.id">
      <el-input v-model="item.value" placeholder="请输入自定义诊断" />
      <el-button type="danger" @click="removeCustomItem(item)">
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>
  </div>
  <el-table
    border
    stripe
    ref="tableRef"
    :data="tableData"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="50" />
    <el-table-column prop="name" label="诊断" />
  </el-table>
  <div class="footer">
    <el-button @click="save" type="primary" style="margin-left: auto">保存</el-button>
    <el-button @click="$emit('done')">取消</el-button>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;

  .el-input {
    flex: 1;
  }
}
.custom-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.footer {
  display: flex;
  margin-top: 15px;
}
</style>
