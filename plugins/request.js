/**
 * 基于axios封装的请求模块
 */

import axios from 'axios'

export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 通过插件机制获取到上下文对象（query，params，req，$store)
export default (context) => {

  const { store, redirect } = context
  // 请求拦截器
  request.interceptors.request.use(function (config) {
    const { user } = store.state
    if(user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
    return config
  }, function (error) {
    // 如果请求失败（请求还没发出）就会进入这里
    return Promise.reject(error)
  })

  request.interceptors.response.use(function (data) {
    return data
  }, function(error) {
    if(error.response && error.response.status === 401) {
      redirect('/login')
    } else {
      throw error
    }
  })
}