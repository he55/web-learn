<script setup lang="ts">
import { reactive, ref, useTemplateRef } from 'vue'
import ToothArea from '@/components/ToothArea.vue'

const props = defineProps<{
  toothData: string
}>()

interface Tooth {
  toothPosition: string
  diagnosis: string
  isMainsuit: boolean
  priority: number
  suggestions: string[]
  description?: string
}

const toothCode = ref(props.toothData)
const formRef = useTemplateRef('formRef')
const formData = reactive<Tooth>({
  toothPosition: '6',
  diagnosis: '',
  isMainsuit: true,
  priority: 2,
  suggestions: [],
  description: '',
})
const diagnosisData = ref([
  {
    value: '',
    label: '牙齿数量问题',
    children: [
      { value: '', label: '牙列缺损' },
      { value: '', label: '先天乳牙缺失' },
    ],
  },
  { value: '', label: '牙齿位置问题', children: [{ value: '', label: '乳牙滞留' }] },
  {
    value: '',
    label: '牙齿形态问题',
    children: [
      { value: '', label: '过小牙' },
      { value: '', label: '伸长牙' },
    ],
  },
])
const suggestionList = ref([
  { id: 1, name: '建议1' },
  { id: 2, name: '建议2' },
  { id: 3, name: '建议3' },
])
</script>

<template>
  <el-form label-width="auto" ref="formRef" :model="formData">
    <el-form-item label="牙位">
      <ToothArea :tooth-code="toothCode" />
    </el-form-item>
    <el-form-item label="诊断">
      <el-cascader
        placeholder="选择诊断"
        clearable
        :show-all-levels="false"
        :options="diagnosisData"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="是否主诉">
      <el-radio-group v-model="formData.isMainsuit">
        <el-radio :value="true">是</el-radio>
        <el-radio :value="false">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="优先级">
      <el-radio-group v-model="formData.priority">
        <el-radio :value="0">无</el-radio>
        <el-radio :value="1">低</el-radio>
        <el-radio :value="2">中</el-radio>
        <el-radio :value="3">高</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="治疗建议">
      <el-select multiple clearable placeholder="选择建议" v-model="formData.suggestions">
        <el-option
          v-for="item in suggestionList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="备注">
      <el-input
        type="textarea"
        placeholder="输入备注"
        :rows="5"
        v-model="formData.description"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="margin-left: auto">保存</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
