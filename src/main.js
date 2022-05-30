import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
// import {install} from '@icon-park/vue/es/all'
import './components/iconpark/index'
import '@icon-park/vue/styles/index.css'
import './components/index'
import store from './store'
import '@/icons'
import {axiosGet, axiosPost, axiosPostWithFile} from './util/axios'
import * as echarts from 'echarts'
import * as allFilters from './util/filters'
Object.keys(allFilters).forEach(key => Vue.filter(key, allFilters[key]))
Vue.use(ViewUI)

const bus = new Vue()
Vue.prototype.$bus = bus
Vue.prototype.$echarts = echarts
Vue.prototype.$axiosGet = axiosGet
Vue.prototype.$axiosPost = axiosPost
Vue.prototype.$axiosPostWithFile = axiosPostWithFile
Vue.config.productionTip = false
// install(Vue, 'ipark')
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render (createElement, context) {
    return createElement(App)
  }
}).$mount('#app')
