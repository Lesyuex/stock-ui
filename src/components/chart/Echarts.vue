<template>
    <div ref="chart" id="chart-wrap">
    </div>
</template>
<script>
export default {
  name: 'Echarts',
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      chart: null
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
  mounted () {
    if (!this.chart) {
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
      if (!that.chart && this.$refs['chart']) that.chart = that.$echarts.init(this.$refs['chart'])
      if (that.chart) {
        that.chart.setOption(options)
        window.addEventListener('resize', () => {
          that.resize()
        })
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
