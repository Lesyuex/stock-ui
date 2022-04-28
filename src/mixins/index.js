export const openTimer = {
  data () {
    return {
      timer: false,
      timerId: null
    }
  },
  created () {
    const that = this
    const timerCount = this.$store.getters.timerCount
    this.$store.dispatch('addTimerCount')
    that.timerId = timerCount + 1
    const currentComponent = `${that.$options.name}${that.timerId}`
    that.$bus.$emit('chilCreated', currentComponent)
    that.$bus.$on(`${currentComponent}StartRequest`, () => {
      that.startRequestInterval()
    })

    that.$bus.$on('stopRequest', () => {
      that.stopRequestInterval()
    })
  },
  methods: {
    startRequestInterval () {
      this.timer = true
      this.refreshData()
    },
    stopRequestInterval () {
      this.timer = false
    }
  },
  beforeDestroy () {
    this.stopRequestInterval()
    this.$bus.$off(`stopRequest`)
    this.$bus.$off(`${this.$options.name}StartRequest`)
  }
}
export default openTimer
