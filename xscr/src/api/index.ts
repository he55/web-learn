import type { DataItem, FormDataType } from '@/types'
import axios from 'axios'

const instance = axios.create({
  timeout: 5_000,
})

instance.interceptors.response.use((response) => {
  return response.data
})

export const getList = async (type: string): Promise<DataItem[]> => {
  return instance.get(`/api/posts?type=${type}`)
}

export const addData = async (data: FormDataType) => {
  await instance.post('/api/posts', data)
}

export const updateData = async (id: number, data: FormDataType) => {
  await instance.put(`/api/posts/${id}`, data)
}

export const deleteData = async (id: number) => {
  await instance.delete(`/api/posts/${id}`)
}
