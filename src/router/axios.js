import axios from 'axios'
import {serialize} from '@/utils/common'
import {getStore} from '@/utils/store'
import NProgress from 'nprogress' // progress bar
import errorCode from '@/router/errorCode'
import {Message, MessageBox} from 'element-ui'
import 'nprogress/nprogress.css'
import qs from 'qs'

axios.defaults.timeout = 30000
// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500 // 默认的
}

// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
NProgress.configure({
  showSpinner: false
})

// HTTP request拦截
axios.interceptors.request.use(config => {
  NProgress.start()
  const TENANT_ID = '1'
  const isToken = (config.headers || {}).isToken === false
  const token = getStore({name: 'access_token'})
  if (token && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + token// token
  }
  if (TENANT_ID) {
    config.headers['TENANT-ID'] = TENANT_ID // 租户ID
  }

  // 开启序列化
  if (config.method === 'post' && config.headers.serialize) {
    config.data = serialize(config.data)
    delete config.data.serialize
  }

  if (config.method === 'get') {
    config.paramsSerializer = function (params) {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

// HTT Presponse拦截
axios.interceptors.response.use(res => {
  NProgress.done()
  const status = Number(res.status) || 200
  const message = res.data.msg || errorCode[status] || errorCode['default']

  // 后台定义 424 针对令牌过去的特殊响应码
  if (status === 424) {
    MessageBox.confirm('令牌状态已过期，请点击重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // 刷新登录页面，避免多次弹框
      window.location.reload()
    }).catch(() => {
    });
    return
  }

  if (status !== 200 || res.data.code === 1) {
    Message({
      message: message,
      type: 'error'
    })
    return Promise.reject(new Error(message))
  }

  return res
}, error => {
  // 处理 503 网络异常
  if (error.response.status === 503) {
    Message({
      message: error.response.data.msg,
      type: 'error'
    })
  }
  NProgress.done()
  return Promise.reject(new Error(error))
})

export default axios
