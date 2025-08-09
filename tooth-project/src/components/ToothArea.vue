<script setup lang="ts">
import { ref, watch } from 'vue'

const { toothCode } = defineProps<{
  toothCode: string
}>()

const s1 = ref('')
const s2 = ref('')
const s3 = ref('')
const s4 = ref('')

const analysis = () => {
  s1.value = ''
  s2.value = ''
  s3.value = ''
  s4.value = ''

  if (toothCode?.length > 1) {
    const c1 = toothCode[0]
    const c2 = toothCode[1]
    if (c1 === '1') {
      s1.value = c2
    } else if (c1 === '2') {
      s2.value = c2
    } else if (c1 === '3') {
      s4.value = c2
    } else if (c1 === '4') {
      s3.value = c2
    }
  }
}

watch(
  () => toothCode,
  () => analysis(),
  { immediate: true },
)
</script>

<template>
  <table>
    <tbody>
      <tr>
        <td class="td1">{{ s1 }}</td>
        <td>{{ s2 }}</td>
      </tr>
      <tr>
        <td class="td3">{{ s3 }}</td>
        <td class="td4">{{ s4 }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: 100%;
  font-size: 18px;
  font-weight: bold;
  table-layout: fixed;
  border-collapse: collapse;
}
tr {
  height: 30px;
}
td {
  padding: 0 5px;
  border-width: 0;
  border-style: solid;
  border-color: var(--el-color-primary);
}
.td1 {
  text-align: right;
  border-width: 0 2px 2px 0;
}
.td3 {
  text-align: right;
}
.td4 {
  border-width: 2px 0 0 2px;
}
</style>
