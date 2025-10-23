<script setup lang="ts">
import { addData, deleteData, getList, updateData } from '@/api'
import type { DataItem, FormDataType } from '@/types'
import { dateFormat, statusFormat } from '@/utils'
import { ElMessage, ElMessageBox, type FormRules } from 'element-plus'
import { onMounted, reactive, ref, useTemplateRef } from 'vue'

type TabName = 'tab1' | 'tab2'

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

const reloadData = async () => {
  const name: TabName = activeName.value

  let type = ''
  if (name === 'tab1') {
    type = '0'
  } else if (name === 'tab2') {
    type = '1'
  }
  tableData.value = await getList(type)
}

const updateItem = (row: DataItem) => {
  mode = 'update'
  formData.value = { ...row } as unknown as FormDataType
  dialogFormVisible.value = true
}
const deleteItem = async (id: number) => {
  await ElMessageBox.confirm('确认删除', '提示', {
    type: 'warning',
  })
  await deleteData(id)
  ElMessage.success('删除成功')
}

const submitForm = async () => {
  await formRef.value?.validate()
  if (mode === 'add') {
    await addData(formData.value)
    ElMessage.success('创建成功')
  } else {
    const d = formData.value
    await updateData(d.id, d)
    ElMessage.success('保存成功')
  }
  dialogFormVisible.value = false
  await reloadData()
}
const openDialog = () => {
  formData.value = {
    doctor: '',
    patient: '',
    method: '',
    status: 0,
  }
  mode = 'add'
  dialogFormVisible.value = true
}
const closeDialog = () => {
  dialogFormVisible.value = false
}
const resetForm = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  reloadData()
})
</script>

<template>
  <el-dialog
    v-model="dialogFormVisible"
    :close-on-click-modal="false"
    @closed="resetForm"
    title="添加手术"
    width="500"
  >
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
  <el-tabs v-model="activeName" @tab-change="reloadData">
    <el-tab-pane name="tab1" label="未完成"> </el-tab-pane>
    <el-tab-pane name="tab2" label="已完成"></el-tab-pane>
  </el-tabs>
  <el-button type="primary" :disabled="activeName !== 'tab1'" @click="openDialog">添加</el-button>
  <el-table :data="tableData" stripe border>
    <el-table-column prop="id" label="编号" min-width="100" />
    <el-table-column prop="doctor" label="手术医生" min-width="100" />
    <el-table-column prop="patient" label="病人姓名" min-width="100" />
    <el-table-column prop="method" label="麻醉方式" min-width="100" />
    <el-table-column
      prop="status"
      label="状态"
      min-width="100"
      :formatter="(row: DataItem) => statusFormat(row.status)"
    />
    <el-table-column
      prop="created_at"
      label="创建时间"
      min-width="180"
      :formatter="(row: DataItem) => dateFormat(row.created_at)"
    />
    <el-table-column label="操作" min-width="150" fixed="right">
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
