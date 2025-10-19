<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Menu as IconMenu, Document, Setting } from '@element-plus/icons-vue'
</script>

<template>
  <el-container>
    <el-aside>
      <el-menu router default-active="/settings/s6">
        <el-menu-item index="/settings/s6">
          <el-icon><IconMenu /></el-icon>
          <span>手术室</span>
        </el-menu-item>
        <el-menu-item index="/settings/s2">
          <el-icon><Document /></el-icon>
          <span>二楼护士站</span>
        </el-menu-item>
        <el-menu-item index="/settings/s3">
          <el-icon><Setting /></el-icon>
          <span>三楼护士站</span>
        </el-menu-item>
        <el-menu-item index="/settings/s4">
          <el-icon><Setting /></el-icon>
          <span>四楼护士站</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
.el-container {
  height: 100%;
}
.el-aside {
  width: 200px;
}
.el-menu {
  height: 100%;
  --el-menu-text-color: #fff;
  --el-menu-hover-text-color: #fff;
  --el-menu-bg-color: #545c64;
  --el-menu-hover-bg-color: rgb(67, 74, 80);
  --el-menu-active-color: #ffd04b;
  --el-menu-level: 0;
}
</style>
