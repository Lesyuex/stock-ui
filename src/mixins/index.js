export const openTimer = {
  data () {
    return {
      timer: null,
      timerId: null
    }
  },
  created () {
    const that = this
    const timerCount = this.$store.getters.timerCount
    this.$store.dispatch('addTimerCount').then(() => {
      that.timerId = timerCount + 1
      const currentComponent = `${that.$options.name}${that.timerId}`
      that.$bus.$emit('chilCreated', currentComponent)
      that.$bus.$on(`${currentComponent}StartRequest`, () => {
        that.startRequestInterval()
      })
    })
    that.$bus.$on('stopRequest', () => {
      that.stopRequestInterval()
    })
  },
  methods: {
    startRequestInterval () {
      const that = this
      that.timer = setTimeout(function () {
        that.refreshData()
      }, 3000)
    },
    stopRequestInterval () {
      this.timer = null
    }
  },
  beforeDestroy () {
    this.stopRequestInterval()
    this.$bus.$off(`stopRequest`)
    this.$bus.$off(`${this.$options.name}StartRequest`)
  }
}
export default openTimer
