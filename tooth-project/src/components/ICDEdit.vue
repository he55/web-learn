<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef, watch } from 'vue'
import ToothArea from '@/components/ToothArea.vue'
import * as api from '@/api'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  done: []
}>()

const { diagId } = defineProps<{
  diagId: number
}>()

const formRef = useTemplateRef('formRef')
const formData = ref<api.Tooth>({
  toothCode: '11',
  diagnosis: null,
  isMainsuit: true,
  priority: 0,
  suggestions: [],
  description: '',
})
const diagnosisData = ref<api.DentalDiagItem[]>([])
const suggestionList = ref<api.DentalTreatmentItem[]>([])

const save = async () => {
  await api.updatePersonDiag(diagId, formData.value)
  ElMessage.success('保存成功')
  emit('done')
}

onMounted(async () => {
  formData.value = await api.getPersonDiag(diagId)
  diagnosisData.value = await api.getDentalDiag()

  const id = formData.value.diagnosis?.at(-1)
  if (id) {
    suggestionList.value = await api.getDentalTreatmentRec(id)
  }

  watch(
    () => formData.value.diagnosis,
    async (newVal) => {
      formData.value.suggestions = []
      suggestionList.value = []
      if (newVal) {
        suggestionList.value = await api.getDentalTreatmentRec(newVal[1])
      }
    },
  )
})
</script>

<template>
  <el-form label-width="auto" ref="formRef" :model="formData">
    <el-form-item label="牙位">
      <ToothArea :tooth-code="formData.toothCode" />
    </el-form-item>
    <el-form-item label="诊断">
      <el-cascader
        v-model="formData.diagnosis"
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
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
      <el-button @click="save" type="primary" style="margin-left: auto">保存</el-button>
      <el-button @click="$emit('done')">取消</el-button>
    </el-form-item>
  </el-form>
</template>
