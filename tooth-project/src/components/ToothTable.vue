<script setup lang="ts">
import { Plus, Edit, View, Delete } from '@element-plus/icons-vue'
import { onMounted, ref, shallowRef, watch } from 'vue'
import ICDEdit from '@/components/ICDEdit.vue'
import DiagnosisEdit from '@/components/DiagnosisEdit.vue'
import * as api from '@/api'
import { formatDate } from '@/utils/date'
import { ElMessage, ElMessageBox } from 'element-plus'

const { reportId } = defineProps<{
  reportId?: number
}>()

type ColumnType = { row: api.PersonDiagItem; column: unknown; $index: number }

const dialogFormVisible = ref(false)
const dialogForm2Visible = ref(false)

const priorityText = ['无', '低', '中', '高']
const priorityType = ['info', 'success', 'warning', 'danger'] as const

const diagId = ref(0)
const editable = ref(false)
const handleAdd = (row: api.PersonDiagItem) => {
  diagId.value = row.id
  dialogForm2Visible.value = true
}
const handleView = (row: api.PersonDiagItem) => {
  editable.value = false
  diagId.value = row.id
  dialogFormVisible.value = true
}
const handleEdit = (row: api.PersonDiagItem) => {
  editable.value = true
  diagId.value = row.id
  dialogFormVisible.value = true
}
const handleDelete = async (row: api.PersonDiagItem) => {
  await ElMessageBox.confirm('是否要删除数据', '确认操作', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await api.deletePersonDiag(row.id)
  ElMessage.success('删除成功')
  await reloadData()
}

const icdSaved = () => {
  dialogForm2Visible.value = false
  reloadData()
}

const diagSaved = () => {
  dialogFormVisible.value = false
  reloadData()
}

const tableData = shallowRef<api.PersonDiagItem[]>([])
const reloadData = async () => {
  if (reportId) {
    tableData.value = await api.getPersonDiagByCheckId(reportId)
  } else {
    tableData.value = []
  }
}

watch(
  () => reportId,
  () => {
    reloadData()
  },
)

onMounted(() => {
  reloadData()
})
</script>

<template>
  <el-dialog v-model="dialogFormVisible" destroy-on-close title="编辑口腔问题" width="500">
    <ICDEdit @done="diagSaved" :diag-id="diagId" :editable="editable" />
  </el-dialog>
  <el-dialog v-model="dialogForm2Visible" destroy-on-close title="编辑诊断" width="500">
    <DiagnosisEdit @done="icdSaved" :diag-id="diagId" />
  </el-dialog>
  <el-table border stripe :data="tableData" :show-overflow-tooltip="true" style="height: 100%">
    <el-table-column type="selection" width="50" />
    <el-table-column prop="toothCode" label="牙位/部位" width="100" />
    <el-table-column prop="diagName" label="诊断" min-width="150" />
    <el-table-column label="主诉" width="80">
      <template #default="{ row }: ColumnType">
        {{ row.isChiefComplaint ? '是' : '否' }}
      </template>
    </el-table-column>
    <el-table-column label="优先级" width="100">
      <template #default="{ row }: ColumnType">
        <el-tag :type="priorityType[row.priority]">{{ priorityText[row.priority] }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="ICD诊断" width="150">
      <template #default="{ row }: ColumnType">
        <el-button v-if="row.icdNames" link type="primary" @click="handleAdd(row)">{{
          row.icdNames
        }}</el-button>
        <el-button v-else link type="primary" :icon="Plus" @click="handleAdd(row)"></el-button>
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="120">
      <template #default="{ row }: ColumnType">
        {{ formatDate(row.createTime) }}
      </template>
    </el-table-column>
    <el-table-column label="操作" width="120" fixed="right">
      <template #default="{ row }: ColumnType">
        <el-button
          link
          type="primary"
          title="查看"
          :icon="View"
          @click="handleView(row)"
        ></el-button>
        <el-button
          link
          type="primary"
          title="编辑"
          :disabled="!row.allowEdit"
          :icon="Edit"
          @click="handleEdit(row)"
        ></el-button>
        <el-button
          link
          type="primary"
          title="删除"
          :icon="Delete"
          @click="handleDelete(row)"
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
