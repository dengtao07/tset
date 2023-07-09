"use strict";

import Vue from 'vue';
import axios from "axios";

import { getToken, setToken } from '@/util/app'


// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 1000000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // console.log('进入拦截器')
    // console.log(service.baseURL)
    if (getToken()) {
      config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    // Do something with request error
   return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const tToken = response.headers['t-token']
    if (tToken && getToken() !== tToken) {
      setToken(tToken, null)
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)
export default service
