<script setup lang="ts">
import { nextTick, onMounted, shallowRef, useTemplateRef } from 'vue'
import * as api from '@/api'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  done: []
}>()

const { diagId } = defineProps<{
  diagId: number
}>()

const tableRef = useTemplateRef('tableRef')
const tableData = shallowRef<api.ICDDiagItem[]>([])

let selecteds: api.ICDDiagItem[]
const handleSelectionChange = (val: api.ICDDiagItem[]) => {
  selecteds = val
}

const save = async () => {
  await api.updatePersonICDInfo(diagId, selecteds)
  ElMessage.success('保存成功')
  emit('done')
}

onMounted(async () => {
  const list = await api.getPersonICDInfo(diagId)
  tableData.value = list

  nextTick(() => {
    list
      .filter((x) => x.selected)
      .forEach((x) => {
        tableRef.value!.toggleRowSelection(x, true)
      })
  })
})
</script>

<template>
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
.footer {
  display: flex;
  margin-top: 15px;
}
</style>
