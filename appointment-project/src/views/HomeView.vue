<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type AppointmentDto, getAppoList, getList } from '@/api'
import { formatDateTime } from '@/utils/date'
import { ElMessage, ElMessageBox } from 'element-plus'

type TableColumnType = {
  row: AppointmentDto
}

const tableData = ref<AppointmentDto[]>([])

const handleEdit = (id: number) => {
  console.log(id)
}
const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('是否要删除数据', '提示')
  ElMessage.success('删除成功')
}
const pageChange = (currentPage: number, pageSize: number) => {
  console.log(currentPage, pageSize)
}

onMounted(async () => {
  // const data = await getList()
  // console.log(data)

  tableData.value = getAppoList()
})
</script>

<template>
  <div class="container">
    <el-form inline>
      <el-form-item label="病人姓名">
        <el-input placeholder="请输入搜索内容" clearable />
      </el-form-item>
      <el-form-item label="预约科室">
        <el-input placeholder="请输入搜索内容" clearable />
      </el-form-item>
      <el-form-item label="预约医生">
        <el-input placeholder="请输入搜索内容" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table stripe border show-overflow-tooltip :data="tableData">
      <el-table-column prop="id" label="编号" width="100" />
      <el-table-column prop="patientName" label="病人姓名" width="100" />
      <el-table-column prop="appoHospital" label="预约医院" width="180" />
      <el-table-column prop="appoDept" label="预约科室" width="100" />
      <el-table-column prop="appoDoctor" label="预约医生" width="100" />
      <el-table-column prop="appoTime" label="预约时间" width="180">
        <template #default="{ row }: TableColumnType">
          {{ formatDateTime(row.appoTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }: TableColumnType">
          {{ row.status === 0 ? '正常' : '取消' }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template #default="{ row }: TableColumnType">
          {{ formatDateTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180" fixed="right">
        <template #default="{ row }: TableColumnType">
          <el-button size="small" type="default" @click="handleEdit(row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @change="pageChange"
    />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}
.el-form-item {
  margin-bottom: 0px;
}
.el-table {
  flex: 1;
}
.el-pagination {
  margin-left: auto;
}
</style>
