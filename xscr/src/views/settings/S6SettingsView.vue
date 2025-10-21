<script setup lang="ts">
import { getList, type DataItem } from '@/api'
import { ElMessage, ElMessageBox, type FormRules } from 'element-plus'
import { onMounted, reactive, ref, useTemplateRef } from 'vue'

type TabName = 'tab1' | 'tab2'
type FormDataType = {
  doctor: string
  patient: string
  method: string
  status: number
}
type ColumnDataType = { row: DataItem }

let mode: 'add' | 'update' = 'add'

const activeName = ref<TabName>('tab1')
const dialogFormVisible = ref(false)

const formRef = useTemplateRef('formRef')
const formData = ref<FormDataType>({
  doctor: '',
  patient: '',
  method: '',
  status: 0,
})
const rules = reactive<FormRules<FormDataType>>({
  doctor: [{ required: true, message: '必填项', trigger: 'blur' }],
  patient: [{ required: true, message: '必填项', trigger: 'blur' }],
  method: [{ required: true, message: '必填项', trigger: 'blur' }],
  status: [{ required: true, message: '必填项', trigger: 'blur' }],
})
const tableData = ref<DataItem[]>([])

const tabChange = async (name: TabName) => {
  let list = await getList()
  if (name === 'tab1') {
    list = list.slice(0, 3)
  } else if (name === 'tab2') {
    list = list.slice(3, 6)
  } else {
    list = []
  }
  tableData.value = list
}

const updateItem = (row: DataItem) => {
  mode = 'update'
  formData.value = { ...row } as unknown as FormDataType
  dialogFormVisible.value = true
}
const deleteItem = async (id: number) => {
  console.log(id)
  await ElMessageBox.confirm('确认删除', '提示', {
    type: 'warning',
  })
  // TODO: fetch api
  ElMessage.success('删除成功')
}

const submitForm = async () => {
  await formRef.value?.validate()
  if (mode === 'add') {
    console.log('add')
    ElMessage.success('创建成功')
  } else {
    console.log('update')
    ElMessage.success('保存成功')
  }
  closeDialog()
}
const openDialog = () => {
  mode = 'add'
  dialogFormVisible.value = true
}
const closeDialog = () => {
  dialogFormVisible.value = false
  formRef.value?.resetFields()
}

onMounted(() => {
  tabChange(activeName.value)
})
</script>

<template>
  <el-dialog v-model="dialogFormVisible" title="添加手术" width="500">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="auto">
      <el-form-item label="手术医生" prop="doctor">
        <el-input v-model="formData.doctor" />
      </el-form-item>
      <el-form-item label="病人姓名" prop="patient">
        <el-input v-model="formData.patient" />
      </el-form-item>
      <el-form-item label="麻醉方式" prop="method">
        <el-input v-model="formData.method" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status">
          <el-option label="等候中" :value="0" />
          <el-option label="手术中" :value="1" />
          <el-option label="完成" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="submit-btn" @click="submitForm">创建</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-tabs v-model="activeName" @tab-change="tabChange">
    <el-tab-pane name="tab1" label="未完成"> </el-tab-pane>
    <el-tab-pane name="tab2" label="已完成"></el-tab-pane>
  </el-tabs>
  <el-button type="primary" :disabled="activeName !== 'tab1'" @click="openDialog">添加</el-button>
  <el-table :data="tableData" stripe border>
    <el-table-column prop="id" label="编号" width="100" />
    <el-table-column prop="doctor" label="手术医生" width="100" />
    <el-table-column prop="patient" label="病人姓名" width="100" />
    <el-table-column prop="method" label="麻醉方式" width="100" />
    <el-table-column prop="status" label="状态" width="100" />
    <el-table-column prop="created_at" label="创建时间" width="180" />
    <el-table-column label="操作" width="150" fixed="right">
      <template #default="{ row }: ColumnDataType">
        <el-button type="primary" size="small" @click="updateItem(row)">修改</el-button>
        <el-button type="danger" size="small" @click="deleteItem(row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
.el-table {
  margin-top: 10px;
}
.submit-btn {
  margin-left: auto;
}
</style>
