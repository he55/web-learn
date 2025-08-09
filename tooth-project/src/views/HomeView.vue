<script setup lang="ts">
import ToothTable from '@/components/ToothTable.vue'
</script>

<template>
  <el-container class="content">
    <el-container class="left">
      <el-main>
        <img src="/1.png" alt="" />
      </el-main>
      <el-footer height="400px">
        <ToothTable />
      </el-footer>
    </el-container>
    <el-aside width="50%">
      <iframe
        frameborder="0"
        src="http://192.168.5.41:8000/result/8db23797-9037-4694-85bd-20de197fbf29"
      ></iframe>
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
  overflow: hidden;
  background-color: white;
}
iframe {
  width: 100%;
  height: 100%;
}
</style>
