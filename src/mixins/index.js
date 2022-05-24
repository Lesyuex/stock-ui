export const openTimer = {
  data () {
    return {
      timerIsOpen: false,
      componentKey: null
    }
  },
  created () {
    const that = this
    const playLoad = {timerId: null}
    this.$store.commit('setTimerId', playLoad)
    if (playLoad.timerId !== null) {
      const componentKey = this.componentKey = `${that.$options.name}${playLoad.timerId}`
      // 先监听
      that.$bus.$on(`${componentKey}StartRequest`, () => {
        that.startRequestInterval()
      })
      that.$bus.$on('stopRequest', () => {
        that.stopRequestInterval()
      })
      // 通知总任务此组件已经创建监听任务
      that.$bus.$emit('timerCreated', componentKey)
    }
  },
  methods: {
    startRequestInterval () {
      const that = this
      this.timerIsOpen = true
      setTimeout(function () {
        that.refreshData()
      }, 3000)
    },
    stopRequestInterval () {
      this.timerIsOpen = false
      this.componentKey = null
    }
  },
  beforeDestroy () {
    this.stopRequestInterval()
    this.$bus.$off(`stopRequest`)
    const componentKey = this.componentKey
    this.$bus.$off(`${componentKey}StartRequest`)
  }
}
export default openTimer
