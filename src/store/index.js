import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    timerId: 0,
    lineColor: '#708bf5'
  },
  /**
   *没有返回值 同步
   *使用 this.$store.commit方法
   */
  mutations: {
    setTimerId: (state, payload) => {
      state.timerId++
      payload.timerId = state.timerId
    },
    setLineColor: (state, lineColor) => {
      state.lineColor = lineColor
    }
  },
  /**
   *自定义方法
   *使用 this.$store.dispath()
   */
  actions: {
    getTimerId: async (context, payload) => {
      return new Promise((resolve) => {
        context.commit('setTimerId', payload)
        resolve()
      })
    },
    setLineColor: (context, lineColor) => {
      context.commit('setLineColor', lineColor)
    }
  },
  /* 相当于get方法 */
  getters: {
    timerCount: state => state.timerCount,
    lineColor: state => state.lineColor
  }
})
export default store
