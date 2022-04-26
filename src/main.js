// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueCard from './components/VueCard'
import router from './router'
import ElementUI from 'element-ui'
import GRow from './components/GRow'
import GCol from './components/GCol'
import 'element-ui/lib/theme-chalk/index.css'
import './static/css/default.css'
import store from './store'
import {axiosGet, axiosPost, axiosPostWithFile} from './util/axios'
import * as echarts from 'echarts'
const bus = new Vue()
Vue.prototype.$bus = bus
Vue.prototype.$echarts = echarts
Vue.prototype.$axiosGet = axiosGet
Vue.prototype.$axiosPost = axiosPost
Vue.prototype.$axiosPostWithFile = axiosPostWithFile
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.component('v-card', VueCard)
Vue.component('g-row', GRow)
Vue.component('g-col', GCol)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
