import request from '@/utils/request'

export type AppointmentDto = {
  id: number
  patientName: string
  appoHospital: string
  appoDept: string
  appoDoctor: string
  appoTime: string
  status: number
  createTime: string
}

export const getList = () => {
  return request.get('/api/RegAppointment/GetList') as Promise<AppointmentDto>
}

export const getAppoList = () => {
  return [
    {
      id: 2,
      patientName: '小明',
      appoHospital: '南京口腔医院',
      appoDept: '儿科',
      appoDoctor: '张医生',
      appoTime: '2025-09-06T07:04:59',
      status: 0,
      createTime: '2025-09-06T12:04:59',
    },
    {
      id: 3,
      patientName: '小红',
      appoHospital: '南京口腔医院',
      appoDept: '儿科',
      appoDoctor: '张医生',
      appoTime: '2025-09-06T07:04:59',
      status: 1,
      createTime: '2025-09-06T12:04:59',
    },
    {
      id: 4,
      patientName: '小六',
      appoHospital: '南京口腔医院',
      appoDept: '儿科',
      appoDoctor: '张医生',
      appoTime: '2025-09-06T07:04:59',
      status: 0,
      createTime: '2025-09-06T12:04:59',
    },
  ] as AppointmentDto[]
}
