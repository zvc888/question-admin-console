import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import store from '../store'
import {
  setToken,
  getToken
} from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 20000, // 请求超时时间
  withCredentials: true
})

// request拦截器
service.interceptors.request.use(
  config => {
    // console.log('service.interceptors.request')
    if (store.getters.token) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // console.log('service.interceptors.response res=' + JSON.stringify(response.data))

    // token 过期，获取刷新后的access-token
    var token = response.headers['Authorization'];
    if (token) {
      setToken(token);
      store.commit('SET_TOKEN', token);
    }

    if (response.config && response.config.responseType == 'blob') {
      const blob = new Blob([response.data], {
        type: 'application/octet-stream;charset=utf-8'
      }); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
      let filename = decodeURI(response.headers['filename']);
      if ('download' in document.createElement('a')) {
        const downloadElement = document.createElement('a');
        let href = '';
        if (window.URL) href = window.URL.createObjectURL(blob);
        else href = window.webkitURL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = filename;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        if (window.URL) window.URL.revokeObjectURL(href);
        else window.webkitURL.revokeObjectURL(href);
        document.body.removeChild(downloadElement);
      } else {
        navigator.msSaveBlob(blob, filename);
      }
      return;
    }

    /**
     * code为非20000是抛错
     */
    const res = response.data
    // console.log('service.interceptors.response res code=' + res.code)
    if (res.code !== 20000) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      // console.log('service.interceptors.response return data')
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
