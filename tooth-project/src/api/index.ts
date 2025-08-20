import request from '@/utils/request'

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
  hasCheckRecord: boolean
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

export const getCheckInfo = (patientId: number) => {
  return request.get(`/api/ICDDiag/GetCheckInfo?patientId=${patientId}`) as Promise<
    DentalCheckRecordDto[]
  >
}

export const getPatientRegInfo = (patientId: number) => {
  return request.get(`/api/ICDDiag/GetPatientRegInfo?patientId=${patientId}`) as Promise<
    MzRegInfoDto[]
  >
}

export const createNewCheckInfo = (regId: number) => {
  return request.post(`/api/ICDDiag/CreateNewCheckInfo?regId=${regId}`) as Promise<void>
}

export const getImageByCheckId = (checkId: number) => {
  return request.get(`/api/ICDDiag/GetImageByCheckId?checkId=${checkId}`) as Promise<CheckImage[]>
}

export const getAIReport = (checkId: number) => {
  return request.get(`/api/ICDDiag/GetAIReport?checkId=${checkId}`) as Promise<AIReport>
}

export const analyseImage = (fileId: number, checkId: number) => {
  return request.post(
    `/api/ICDDiag/AnalyseImage?fileId=${fileId}&checkId=${checkId}`,
  ) as Promise<void>
}

export const getDentalDiag = () => {
  return request.get('/api/ICDDiag/GetDentalDiag') as Promise<DentalDiagItem[]>
}

export const getDentalTreatmentRec = (id: number) => {
  return request.get(`/api/ICDDiag/GetDentalTreatmentRec?dentalDiagId=${id}`) as Promise<
    DentalTreatmentItem[]
  >
}

export const getPersonDiagByCheckId = (checkId: number) => {
  return request.get(`/api/ICDDiag/GetPersonDiagByCheckId?checkId=${checkId}`) as Promise<
    PersonDiagItem[]
  >
}

export const getPersonICDInfo = (id: number) => {
  return request.get(`/api/ICDDiag/GetPersonICDInfo?id=${id}`) as Promise<ICDDiagItem[]>
}

export const updatePersonICDInfo = (id: number, data: ICDDiagItem[]) => {
  return request.put(`/api/ICDDiag/UpdatePersonICDInfo?id=${id}`, data) as Promise<void>
}

export const getPersonDiag = (id: number) => {
  return request.get(`/api/ICDDiag/GetPersonDiag?id=${id}`) as Promise<Tooth>
}

export const deletePersonDiag = (id: number) => {
  return request.delete(`/api/ICDDiag/DeletePersonDiag?id=${id}`) as Promise<void>
}

export const updatePersonDiag = (id: number, data: Tooth) => {
  return request.put(`/api/ICDDiag/UpdatePersonDiag?id=${id}`, data) as Promise<void>
}
