<script setup lang="ts">
import { getList, type DataItem } from '@/api'
import { onMounted, ref } from 'vue'

type TabName = 'tab1' | 'tab2'
type ColumnDataType = { row: DataItem }

const activeName = ref<TabName>('tab1')
const tableData = ref<DataItem[]>([])

const click = (row: DataItem) => {
  console.log(row)
}
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

onMounted(() => {
  tabChange(activeName.value)
})
</script>

<template>
  <el-tabs v-model="activeName" @tab-change="tabChange">
    <el-tab-pane name="tab1" label="未完成"> </el-tab-pane>
    <el-tab-pane name="tab2" label="已完成"></el-tab-pane>
  </el-tabs>
  <el-table :data="tableData" stripe border>
    <el-table-column prop="id" label="编号" />
    <el-table-column prop="doctor" label="手术医生" />
    <el-table-column prop="patient" label="病人姓名" />
    <el-table-column prop="method" label="麻醉方式" />
    <el-table-column prop="status" label="状态" />
    <el-table-column label="操作">
      <template #default="{ row }: ColumnDataType">
        <el-button @click="click(row)" type="primary" size="small">设置状态</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
