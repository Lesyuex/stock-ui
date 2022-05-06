<template>
  <div>
    <echarts :options="options" ref="chart"/>
  </div>
</template>

<script>
import Echarts from '../../../components/Echarts'
export default {
  components: {
    Echarts
  },
  props: {
    pieData: Array
  },
  name: 'BarChart',
  data () {
    return {
      options: {}
    }
  },
  watch: {
    pieData: {
      deep: true,
      handler: function (newVal) {
        this.initOptions()
      }
    }
  },
  mounted () {
    this.initOptions()
  },
  methods: {
    initOptions () {
      if (!this.pieData) return
      this.options = {
        // 自定义系列颜色
        color: ['#ee4957', 'gray', '#01d078'],
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '60%',
            startAngle: 270,
            center: ['55%', '50'],
            data: this.pieData,
            label: {
              color: '#ccc',
              formatter: '{b}:{c}家'
            },
            labelLine: {
              lineStyle: {
                color: '#ccc'
              },
              smooth: 0.2,
              length: 5,
              length2: 10
            }
          }
        ]
      }
    }
  }
}
</script>
<style scoped lang="less">
  div{
  width:100%;
  height: 100%;
  background-color: transparent;
}
</style>
