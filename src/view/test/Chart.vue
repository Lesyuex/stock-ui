<template>
<div >
<div id="chart"></div>
</div>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.initChart()
  },
  methods: {
    initChart () {
      this.chart = this.$echarts.init(document.getElementById('chart'))
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          containLabel: true,
          backgroundColor: '#051e2e'
        },
        xAxis: {
          name: '月份',
          nameLocation: 'start',
          nameTextStyle: {
            color: '#dfe9f0',
            fontSize: 14
          },
          type: 'value',
          axisLabel: {
            color: '#dfe9f0',
            fontSize: 14,
            verticalAlign: 'bottom'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          min: 0,
          max: 12,
          interval: 1
        },
        yAxis: {
          type: 'category',
          axisTick: { show: false },
          axisLabel: {
            color: '#dfe9f0',
            fontSize: 14
          },
          data: ['里程碑4', '里程碑3', '里程碑2', '里程碑1']
        },
        color: ['rgba(0,0,0,.1)', '#eb7d31'],
        series: [
          {
            name: '2022',
            type: 'bar',
            barWidth: 20,
            label: {
              show: true,
              position: 'outside',
              formatter: function (series) {
                const data = series.data
                const label = (data.completed * 100 / data.value).toFixed(0)
                return label + '%'
              }
            },
            itemStyle: {
              borderWidth: 1,
              borderColor: '#51b6dc'
            },
            data: [
              {value: 12, completed: 3},
              {value: 9, completed: 3},
              {value: 6, completed: 3},
              {value: 3, completed: 3}]
          },
          {
            name: '2011',
            type: 'bar',
            barWidth: 20,
            barGap: '-100%',
            itemStyle: {
              borderWidth: 1,
              borderColor: '#51b6dc'
            },
            label: {
              show: false
            },
            data: [3, 3, 3, 3]
          }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>

<style scoped>
#chart{
  height: 500px;
  width: 460px;
  background-color: #051e2e;
}
</style>
