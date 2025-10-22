import axios from 'axios'

export type DataItem = {
  id: number
  doctor: string
  patient: string
  method: string
  status: number
  created_at: string
}

const instance = axios.create({
  baseURL: '',
  timeout: 5_000,
})

instance.interceptors.response.use((response) => {
  return response.data
})

export const getList = async (): Promise<DataItem[]> => {
  return instance.get('/api/getList.json')
}
