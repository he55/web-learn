import request from '@/utils/request'

export type DentalDiagItem = {
  value: number
  label: string
  children?: DentalDiagItem[]
}

export type DentalTreatmentItem = {
  value: number
  label: string
  isRecommend: boolean
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
  hasCheckRecord: boolean
}

export type DentalCheckRecordDto = {
  id: number
  patientId: number
  regTime: string
  processState: number
}

export type AIReport = {
  report: string
}

export type CheckImage = {
  imageId: number
  imageName: string
  url: string
}

export type AIResult = {
  status: number
  msg: string
}

export const getCheckInfo = (patientId: number): Promise<DentalCheckRecordDto[]> => {
  return request.get(`/api/ICDDiag/GetCheckInfo?patientId=${patientId}`)
}

export const getPatientRegInfo = (patientId: number): Promise<MzRegInfoDto[]> => {
  return request.get(`/api/ICDDiag/GetPatientRegInfo?patientId=${patientId}`)
}

export const createNewCheckInfo = (regId: number): Promise<void> => {
  return request.post(`/api/ICDDiag/CreateNewCheckInfo?regId=${regId}`)
}

export const getImageByCheckId = (checkId: number): Promise<CheckImage[]> => {
  return request.get(`/api/ICDDiag/GetImageByCheckId?checkId=${checkId}`)
}

export const checkAIReportIsExists = (checkId: number): Promise<AIResult> => {
  return request.get(`/api/ICDDiag/CheckAIReportIsExists?checkId=${checkId}`)
}

export const getAIReport = (checkId: number): Promise<AIReport> => {
  return request.get(`/api/ICDDiag/GetAIReport?checkId=${checkId}`)
}

export const analyseImage = (fileId: number, checkId: number): Promise<void> => {
  return request.post(`/api/ICDDiag/AnalyseImage?fileId=${fileId}&checkId=${checkId}`)
}

export const getDentalDiag = (): Promise<DentalDiagItem[]> => {
  return request.get('/api/ICDDiag/GetDentalDiag')
}

export const getDentalTreatmentRec = (id: number): Promise<DentalTreatmentItem[]> => {
  return request.get(`/api/ICDDiag/GetDentalTreatmentRec?dentalDiagId=${id}`)
}

export const getPersonDiagByCheckId = (checkId: number): Promise<PersonDiagItem[]> => {
  return request.get(`/api/ICDDiag/GetPersonDiagByCheckId?checkId=${checkId}`)
}

export const getPersonICDInfo = (id: number): Promise<ICDDiagItem[]> => {
  return request.get(`/api/ICDDiag/GetPersonICDInfo?id=${id}`)
}

export const updatePersonICDInfo = (id: number, data: ICDDiagItem[]): Promise<void> => {
  return request.put(`/api/ICDDiag/UpdatePersonICDInfo?id=${id}`, data)
}

export const getPersonDiag = (id: number): Promise<Tooth> => {
  return request.get(`/api/ICDDiag/GetPersonDiag?id=${id}`)
}

export const deletePersonDiag = (id: number): Promise<void> => {
  return request.delete(`/api/ICDDiag/DeletePersonDiag?id=${id}`)
}

export const batchDeletePersonDiag = (patientId: number, ids: number[]): Promise<void> => {
  return request.delete(`/api/ICDDiag/BatchDeletePersonDiag?patientId=${patientId}`, {
    data: ids,
  })
}

export const updatePersonDiag = (id: number, data: Tooth): Promise<void> => {
  return request.put(`/api/ICDDiag/UpdatePersonDiag?id=${id}`, data)
}
