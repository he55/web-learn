import axios from 'axios'
import { ElMessage } from 'element-plus'

export type DentalDiagItem = {
  value: number
  label: string
  children?: DentalDiagItem[]
}

export type DentalTreatmentItem = {
  value: number
  label: string
}

export type ICDDiagItem = {
  id: number
  name: string
  selected: boolean
}

export interface PersonDiagItem {
  id: number
  toothCode: string
  diagName: string
  isChiefComplaint: boolean
  priority: number
  icdNames: string
  createTime: string
  allowEdit: boolean
}

export interface Tooth {
  toothCode: string
  diagnosis: number[] | null
  isMainsuit: boolean
  priority: number
  suggestions: number[] | null
  description?: string
}

export type MzRegInfoDto = {
  patientId: number
  registerTime: string
  attendStatusName: string
  lastDocName: string
  consultingProjectName: string
  regId: number
}

export type DentalCheckRecordDto = {
  id: number
  patientId: number
  regTime: string
}

export type AIReport = {
  report: string
}

export type CheckImage = {
  imageId: number
  imageName: string
  url: string
}

const p = new URLSearchParams(location.search)
const token = p.get('token')

axios.interceptors.request.use((req) => {
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

axios.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    if (!err.response) {
      ElMessage.error('网络连接失败')
      return Promise.reject(err)
    }

    if (err.status === 500) {
      ElMessage.error(err.response.data?.error || '请求出错，请重试')
    } else if (err.status === 401) {
      ElMessage.error('请先登录')
    } else {
      ElMessage.error('请求出错，请重试')
    }
    return Promise.reject(err)
  },
)

export const getCheckInfo = (patientId: number) => {
  return axios.get(`/api/ICDDiag/GetCheckInfo?patientId=${patientId}`) as Promise<
    DentalCheckRecordDto[]
  >
}

export const getPatientRegInfo = (patientId: number) => {
  return axios.get(`/api/ICDDiag/GetPatientRegInfo?patientId=${patientId}`) as Promise<
    MzRegInfoDto[]
  >
}

export const createNewCheckInfo = (regId: number) => {
  return axios.post(`/api/ICDDiag/CreateNewCheckInfo?regId=${regId}`) as Promise<void>
}

export const getImageByCheckId = (checkId: number) => {
  return axios.get(`/api/ICDDiag/GetImageByCheckId?checkId=${checkId}`) as Promise<CheckImage[]>
}

export const getAIReport = (checkId: number) => {
  return axios.get(`/api/ICDDiag/GetAIReport?checkId=${checkId}`) as Promise<AIReport>
}

export const getDentalDiag = () => {
  return axios.get('/api/ICDDiag/GetDentalDiag') as Promise<DentalDiagItem[]>
}

export const getDentalTreatmentRec = (id: number) => {
  return axios.get(`/api/ICDDiag/GetDentalTreatmentRec?dentalDiagId=${id}`) as Promise<
    DentalTreatmentItem[]
  >
}

export const getPersonDiagByCheckId = (checkId: number) => {
  return axios.get(`/api/ICDDiag/GetPersonDiagByCheckId?checkId=${checkId}`) as Promise<
    PersonDiagItem[]
  >
}

export const getPersonICDInfo = (id: number) => {
  return axios.get(`/api/ICDDiag/GetPersonICDInfo?id=${id}`) as Promise<ICDDiagItem[]>
}

export const updatePersonICDInfo = (id: number, data: ICDDiagItem[]) => {
  return axios.put(`/api/ICDDiag/UpdatePersonICDInfo?id=${id}`, data) as Promise<void>
}

export const getPersonDiag = (id: number) => {
  return axios.get(`/api/ICDDiag/GetPersonDiag?id=${id}`) as Promise<Tooth>
}

export const deletePersonDiag = (id: number) => {
  return axios.delete(`/api/ICDDiag/DeletePersonDiag?id=${id}`) as Promise<void>
}

export const updatePersonDiag = (id: number, data: Tooth) => {
  return axios.put(`/api/ICDDiag/UpdatePersonDiag?id=${id}`, data) as Promise<void>
}
