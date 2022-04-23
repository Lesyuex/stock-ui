import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    timerCount: 0
  },
  mutations: {
    addTimerCount: (state) => {
      state.timerCount++
    }
  },
  actions: {
    addTimerCount: (context) => {
      context.commit('addTimerCount')
    }
  },
  getters: {
    timerCount: state => {
      return state.timerCount
    }
  }
})
export default store
