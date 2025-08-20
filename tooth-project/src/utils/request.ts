import axios from 'axios'
import { ElMessage } from 'element-plus'
import { buildSignature, generateRandom } from './crypto-helper'

const instance = axios.create({
  timeout: 5_000,
})

const p = new URLSearchParams(location.search)
const token = p.get('token')

instance.interceptors.request.use((req) => {
  if (token) {
    req.headers.Authorization = token
  }

  const traceId = generateRandom(32)
  const timestamp = new Date().getTime()
  const signature = buildSignature(req.method!.toUpperCase() + traceId + timestamp + (token || ''))
  req.headers['X-TraceId'] = traceId
  req.headers['X-Timestamp'] = timestamp
  req.headers['X-Signature'] = signature

  return req
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
