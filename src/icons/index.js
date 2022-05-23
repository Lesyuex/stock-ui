import SvgIcon from '../components/svg/SvgIcon'
import Vue from 'vue'

// 定义一个加载目录的函数
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
// 加载目录下的所有 svg 文件
requireAll(req)
Vue.component('svg-icon', SvgIcon)
