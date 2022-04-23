import axios from 'axios'
axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true
// axios请求前做些什么
axios.interceptors.request.use(config => {
  config.headers.common['Sys-Token'] = ''
  return config
}, error => {
// 对请求错误做些什么
  return Promise.reject(error)
})
// axios接收响应前做些什么
axios.interceptors.response.use(res => {
  return res.data
}, error => {
  return Promise.reject(error)
})

// axios get请求 url?key=value
export const axiosGet = (url, param) => {
  return axios({
    url: url,
    method: 'get',
    params: param
  })
}
// axios post请求 请求参数放入请求体中
export const axiosPost = (url, data) => {
  return axios({
    url: url,
    method: 'get',
    data: data
  })
}

// 含有文件的请求
export const axiosPostWithFile = (url, data) => {
  return axios({
    url: url,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
