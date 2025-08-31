<script setup lang="ts">
import { onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue'
import ToothArea from '@/components/ToothArea.vue'
import * as api from '@/api'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  done: []
}>()

const { diagId, editable = true } = defineProps<{
  diagId: number
  editable?: boolean
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
const diagnosisData = shallowRef<api.DentalDiagItem[]>([])
const suggestionList = shallowRef<
  {
    label: string
    options: api.DentalTreatmentItem[]
  }[]
>([])

const save = async () => {
  await api.updatePersonDiag(diagId, formData.value)
  ElMessage.success('保存成功')
  emit('done')
}

const getSuggestionList = async (id: number) => {
  const data = await api.getDentalTreatmentRec(id)
  const arr = [
    {
      label: '其他治疗建议',
      options: data.filter((x) => !x.isRecommend),
    },
  ]

  const b = data.filter((x) => x.isRecommend)
  if (b.length) {
    arr.unshift({
      label: '推荐治疗建议',
      options: b,
    })
  }
  return arr
}

onMounted(async () => {
  const data = await api.getPersonDiag(diagId)
  const data2 = await api.getDentalDiag()

  const id = data.diagnosis?.at(-1)
  if (id) {
    for (const element of data2) {
      const c = element.children?.find((x) => x.value === id)
      if (c) {
        data.diagnosis = [element.value, id]
      }
    }
    suggestionList.value = await getSuggestionList(id)
  }

  formData.value = data
  diagnosisData.value = data2

  watch(
    () => formData.value.diagnosis,
    async (newVal) => {
      formData.value.suggestions = []
      suggestionList.value = []
      if (newVal) {
        suggestionList.value = await getSuggestionList(newVal[1])
      }
    },
  )
})
</script>

<template>
  <el-form label-width="auto" ref="formRef" :model="formData" :disabled="!editable">
    <el-form-item label=" ">
      <ToothArea :tooth-code="formData.toothCode" />
    </el-form-item>
    <el-form-item label="牙位">
      <el-input v-model="formData.toothCode" disabled />
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
        <el-option-group v-for="group in suggestionList" :key="group.label" :label="group.label">
          <el-option
            v-for="item in group.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-option-group>
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
