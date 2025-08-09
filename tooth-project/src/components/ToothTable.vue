<script setup lang="ts">
import { Plus, Edit, View, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ICDEdit from '@/components/ICDEdit.vue'

interface Tooth {
  id: number
  code: string
  diagnosis: string
  isMainsuit: boolean
  priority: number
  date: string
}
type ColumnType = { row: Tooth; column: unknown; $index: number }

const dialogFormVisible = ref(false)
const toothData = ref('12')

const priorityText = ['无', '低', '中', '高']
const priorityType = ['info', 'success', 'warning', 'danger'] as const

const handleAdd = (row: Tooth) => {
  console.log(row)
}
const handleView = (row: Tooth) => {
  console.log(row)
}
const handleEdit = (row: Tooth) => {
  toothData.value = row.code
  dialogFormVisible.value = true
}
const handleDelete = (row: Tooth) => {
  console.log(row)
}

const tableData: Tooth[] = [
  {
    id: 1,
    code: '36',
    diagnosis: '牙列缺损',
    isMainsuit: true,
    priority: 1,
    date: '2016-05-03',
  },
  {
    id: 2,
    code: '37',
    diagnosis: '牙列缺损',
    isMainsuit: false,
    priority: 2,
    date: '2016-05-03',
  },
  {
    id: 3,
    code: '41',
    diagnosis: '牙列缺损',
    isMainsuit: false,
    priority: 3,
    date: '2016-05-03',
  },
  {
    id: 4,
    code: '47',
    diagnosis: '牙列缺损',
    isMainsuit: false,
    priority: 0,
    date: '2016-05-03',
  },
]
</script>

<template>
  <el-dialog v-model="dialogFormVisible" destroy-on-close title="编辑口腔问题" width="500">
    <ICDEdit :tooth-data="toothData" />
  </el-dialog>
  <el-table border stripe :data="tableData" style="height: 100%">
    <el-table-column type="selection" width="50" />
    <el-table-column prop="code" label="牙位/部位" width="100" />
    <el-table-column prop="diagnosis" label="诊断" min-width="150" />
    <el-table-column label="主诉" width="80">
      <template #default="{ row }: ColumnType">
        {{ row.isMainsuit ? '是' : '否' }}
      </template>
    </el-table-column>
    <el-table-column label="优先级" width="100">
      <template #default="{ row }: ColumnType">
        <el-tag :type="priorityType[row.priority]">{{ priorityText[row.priority] }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="ICD诊断" width="150">
      <template #default="{ row }: ColumnType">
        <el-button link type="primary" :icon="Plus" @click="handleAdd(row)"></el-button>
      </template>
    </el-table-column>
    <el-table-column prop="date" label="创建时间" width="120" />
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
