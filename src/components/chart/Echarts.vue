<template>
    <div ref="chart" id="chart-wrap">
    </div>
</template>
<script>
export default {
  name: 'Echarts',
  props: {
    eventName: {
      type: String,
      default: null
    },
    options: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      chart: null,
      resizeTimer: null
    }
  },
  watch: {
    options: {
      deep: true,
      handler (newVal) {
        this.drawChart(newVal)
      }
    }
  },
  beforeDestroy () {
    this.$bus.$off('resizeChart')
  },
  mounted () {
    this.$bus.$on('resizeChart', () => {
      this.$nextTick(() => {
        this.resize()
      })
    })
    if (!this.chart) {
      if (!Object.hasOwnProperty('animation')) {
        this.options.animation = false
      }
      this.drawChart(this.options)
    }
  },
  methods: {
    resize () {
      const that = this
      that.chart.resize()
    },
    drawChart (options) {
      const that = this
      if (!that.chart && this.$refs['chart']) {
        that.chart = that.$echarts.init(this.$refs['chart'], null, {
          renderer: 'svg',
          devicePixelRatio: 2
        })
      }
      if (that.chart) {
        that.chart.setOption(options)
        if (this.eventName) {
          that.chart.on(that.eventName, function () {
            that.$emit('handleEvent')
          })
        }
        window.addEventListener('resize', () => {
          // 防抖
          if (that.resizeTimer !== null) window.clearTimeout(that.resizeTimer)
          that.resizeTimer = setTimeout(function () {
            console.log('resizeChart')
            that.resize()
          }, 600)
        }, false)
      }
    }
  }
}
</script>
<style scoped>
#chart-wrap{
  float: left;
  height: 100%;
  width: 100%;
}
</style>
