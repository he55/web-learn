import axios from 'axios'
import { ElMessage } from 'element-plus'

const token = localStorage.getItem('token')

const instance = axios.create({
  timeout: 5_000,
})

instance.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
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

export default instance
