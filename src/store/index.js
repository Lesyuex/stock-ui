import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    timerCount: 0,
    lineColor: '#708bf5'
  },
  mutations: {
    addTimerCount: (state) => {
      state.timerCount++
    },
    setLineColor: (state, lineColor) => {
      state.lineColor = lineColor
    }
  },
  actions: {
    addTimerCount: (context) => {
      context.commit('addTimerCount')
    },
    setLineColor: (context, lineColor) => {
      context.commit('setLineColor', lineColor)
    }
  },
  getters: {
    timerCount: state => state.timerCount,
    lineColor: state => state.lineColor
  }
})
export default store
