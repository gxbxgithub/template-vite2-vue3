/**
 * 对 axios 进行二次封装
 * 目的是为了让 axios 发送请求时，具有其它的功能
 * 操作：
 * 1. 配置基础路径和超时限制
 * 2. 添加进度条信息
 * 3. 返回的响应不需要从data中取数据，而是响应就是我们要的数据
 * 4. 统一处理请求错误，具体请求可以选择处理和不处理
 */

import axios from 'axios'
import { toast, Loading } from '@/libs/message'
import { JWT_TOKEN_KEY } from '@/libs/constant';
import router from '../router'

/**
 * 公共配置
 */
const config = {
  // 1. 配置基础路径和超时限制
  baseURL: '/api',
  timeout: 20000
}
const handleReq = config => {
  const token = localStorage.getItem(JWT_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}
const handleRes = response => {
  const result = response.data
  if (result.code == 0) {
    return result
  }
  // token无效
  if (result.code == 10005) {
    console.log(router);
    router.replace('/login')
    return null
  }
  toast(result.message, 'error')
  return null
}
const handleResErr = error => {
  return Promise.reject(error)
}


/**
 * 默认的service
 */
// axios.create() 创建一个新的和 axios 相同功能的实例
const axiosInstance = axios.create(config);
axiosInstance.interceptors.request.use(config => handleReq(config))
axiosInstance.interceptors.response.use(
  response => handleRes(response),
  error => handleResErr(error)
)



/**
 * 带有Loading的service
 */
const loading = new Loading(false)
const axiosLoadingInstance = axios.create(config)
axiosLoadingInstance.interceptors.request.use(
  config => {
    // 显示loading
    loading.open()
    return handleReq(config)
  }
)
axiosLoadingInstance.interceptors.response.use(
  response => {
    loading.close()
    return handleRes(response)
  },
  error => {
    loading.close()
    return handleResErr(error)
  }
)



class ServiceClass {
  constructor(instance) {
    this.service = instance
  }
  get(url, params) {
    return this.service.get(url, { params })
  }
  post(url, data) {
    return this.service.post(url, data)
  }
  put(url, data) {
    return this.service.put(url, data)
  }
  delete(url, params) {
    return this.service.delete(url, { params })
  }
  service() {
    return this.service
  }
}
const service = new ServiceClass(axiosInstance)
const serviceLoading = new ServiceClass(axiosLoadingInstance)

export { service, serviceLoading }