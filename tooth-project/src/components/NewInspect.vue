<script setup lang="ts">
import { inject, onMounted, ref, shallowRef } from 'vue'
import * as api from '@/api'
import { ElMessage } from 'element-plus'
import { formatDateTime } from '@/utils/date'

const emit = defineEmits<{
  requestClose: [needReload?: boolean]
}>()

type ColumnType = {
  row: api.MzRegInfoDto
}

const patientId = inject<number>('patientId')

const tableData = shallowRef<api.MzRegInfoDto[]>([])

const selected = ref<api.MzRegInfoDto>()
const handleCurrentChange = (val: api.MzRegInfoDto) => {
  selected.value = val
}

const save = async () => {
  await api.createNewCheckInfo(selected.value!.regId)
  ElMessage.success('保存成功')
  emit('requestClose', true)
}

onMounted(async () => {
  if (patientId) {
    tableData.value = await api.getPatientRegInfo(patientId)
  }
})
</script>

<template>
  <el-table
    border
    stripe
    highlight-current-row
    :data="tableData"
    @current-change="handleCurrentChange"
  >
    <el-table-column prop="registerTime" label="预约时间">
      <template #default="{ row }: ColumnType">
        {{ formatDateTime(row.registerTime) }}
      </template>
    </el-table-column>
    <el-table-column prop="lastDocName" label="预约医生" />
    <el-table-column prop="consultingProjectName" label="预约项目" />
    <el-table-column prop="attendStatusName" label="就诊类型" />
  </el-table>
  <div class="footer">
    <el-button @click="save" :disabled="!selected" type="primary" style="margin-left: auto"
      >创建</el-button
    >
    <el-button @click="$emit('requestClose')">取消</el-button>
  </div>
</template>

<style scoped>
.footer {
  display: flex;
  margin-top: 15px;
}
</style>
