import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IndexLayout',
      redirect: '/stock-home',
      component: () => import('../layout/Index'),
      children: [
        {
          path: '/stock-home',
          name: 'Home',
          component: () => import('../view/stock/Index')
        },
        {
          path: '/self-collect',
          name: 'SelfCollect',
          component: () => import('../view/selfCollect/SelfCollect')
        },
        {
          path: '/test-page',
          name: 'TestPage',
          component: () => import('../view/stock/Index')
        }
      ]
    }
  ]
})
