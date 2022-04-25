import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IndexLayout',
      redirect: '/self-collect',
      component: () => import('../layout/IndexLayout'),
      children: [
        {
          path: '/china-share',
          name: 'Index',
          component: () => import('../view/stock/chinaStock/Index')
        },
        {
          path: '/self-collect',
          name: 'SelfCollect',
          component: () => import('../view/selfCollect/SelfCollect')
        },
        {
          path: '/test-page',
          name: 'TestPage',
          component: () => import('../view/selfCollect/Test')
        }
      ]
    }
  ]
})
