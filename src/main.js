import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import './components/index'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import store from './store'
import '@/icons'
import {axiosGet, axiosPost, axiosPostWithFile} from './util/axios'
import * as echarts from 'echarts'
import * as allFilters from './util/filters'
Object.keys(allFilters).forEach(key => Vue.filter(key, allFilters[key]))
Vue.use(ElementUI)

const bus = new Vue()
Vue.prototype.$bus = bus
Vue.prototype.$echarts = echarts
Vue.prototype.$axiosGet = axiosGet
Vue.prototype.$axiosPost = axiosPost
Vue.prototype.$axiosPostWithFile = axiosPostWithFile
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render (createElement, context) {
    return createElement(App)
  }
}).$mount('#app')
