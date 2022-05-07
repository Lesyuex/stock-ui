<template>
  <div style="width: 100%;height: 100%;">
    <echarts :options="option" ref="chart"/>
  </div>
</template>

<script>
import Echarts from '../../../components/Echarts'

export default {
  props: {
    customOption: {
      type: Object,
      required: true
    }
  },
  components: {
    Echarts
  },
  name: 'BarChart',
  data () {
    return {
      option: {}
    }
  },
  mounted () {
    this.initOptions()
  },
  watch: {
    customOption: {
      deep: true,
      handler: function (val) {
        this.initOptions()
      }
    }
  },
  methods: {
    initOptions () {
      const data = this.customOption
      this.option = {
        // 自定义系列颜色
        color: data.color || ['#fac858', '#5485E8', '#59D7A5'],
        title: {
          text: data.chartTitle || '',
          top: data.chartTitleTop || 12,
          left: data.chartTitleLeft || 4,
          textStyle: {
            align: 'center',
            color: data.chartTitleColor || '#fff',
            fontSize: data.chartTitleFontSize || 16,
            fontWeight: 400
          }
        },
        legend: {
          show: !data.hideLegend,
          left: data.legendLeft ? data.legendLeft : 'center',
          top: data.legendTop ? data.legendTop : 20,
          orient: data.legendOrient ? data.legendOrient : 'horizontal',
          itemGap: data.legendItemGap ? data.legendItemGap : 20,
          textStyle: {
            color: data.legendTextColor || '#fff',
            fontSize: data.legendTextFontSize || 16
          }
        },
        tooltip: {
          show: !data.hideTooltip,
          trigger: data.trigger || 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: data.formatter ? data.formatter : null
        },
        grid: {
          width: data.gridWidth || '100%',
          left: data.containLabel ? (data.gridLeft ? data.gridLeft : 0) : data.gridLeft || 'center',
          bottom: data.containLabel ? (data.gridBottom ? data.gridBottom : 2) : data.gridBottom || 35,
          right: data.gridRight ? data.gridRight : 0,
          top: data.gridTop || 70,
          containLabel: !data.notContainLabel
        },
        xAxis: [
          {
            show: !data.hideX1,
            type: 'category',
            position: data.showHelpX ? 'top' : 'bottom',
            data: data.xAxisData,
            fontSize: data.x1FontSize || 16,
            axisLine: {
              show: data.hideX1 ? false : !data.hideX1Line
            },
            axisLabel: {
              show: data.hideX1 ? false : !data.hideX1Label,
              interval: data.showX1AllLabel ? 0 : null,
              formatter: data.x1LableFormatter ? data.x1LableFormatter : '{value}',
              color: data.x1LabelColor || '#adb4c2',
              fontSize: data.x1LabelFS || 12
            },
            splitLine: {
              show: data.hideX1 ? false : data.showX1Split
            },
            axisTick: {
              show: data.hideX1 ? false : data.showX1Tick
            }
          },
          {
            show: data.showHelpX,
            type: 'value',
            gridIndex: 0,
            z: 1,
            boundaryGap: false,
            position: data.showHelpX ? 'bottom' : 'top',
            data: [1, 2, 3, 4, 5],
            min: 1,
            max: 5,
            interval: 1,
            axisLabel: {
              show: true,
              color: '#ccc',
              formatter: function (value) {
                if (value === 1) return '09:30'
                if (value === 2) return '10:30'
                if (value === 3) return '11:30/13:00'
                if (value === 4) return '14:00'
                if (value === 5) return '15:00'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#1e3139'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#1e3139'
              }
            },
            axisPointer: {
              show: false
            }
          }
        ],
        yAxis: {
          show: !data.hideY1,
          type: 'value',
          fontSize: data.yFontSize || 16,
          splitNumber: data.splitNumber || 3,
          axisLine: {
            show: !data.hideY1Line
          },
          axisLabel: {
            show: !data.hideY1Label,
            formatter: data.yLabelFormatter ? data.yLabelFormatter : null
          },
          splitLine: {
            show: !data.hideY1Split,
            lineStyle: {
              type: 'dashed',
              width: 0.5,
              color: '#383838'
            }
          },
          axisTick: {
            show: data.hideY1 ? false : data.showY1Tick
          }
        },
        series: this.initSeries()
      }
    },
    // 自定义series项数据
    initSeries () {
      const data = this.customOption
      // 生成series的对应数据
      const seriesData = data.seriesData.map(data => {
        return data
      })
      if (data.seriesNameArr) {
        return data.seriesNameArr.map((name, index) => {
          return {
            name: name || '',
            // eslint-disable-next-line valid-typeof
            type: data.seriesType ? data.seriesType[index] : 'bar',
            // 左边放数值，右边放百分比
            yAxisIndex: data.doubleYLine ? (data.seriesType[index] === 'bar' ? 0 : 1) : 0,
            symbol: 'circle',
            symbolSize: data.symbolSize ? data.symbolSize : null,
            barWidth: data.barWidth ? data.barWidth : 25,
            barMaxWith: data.barMaxWith ? data.barMaxWith : 50,
            // 右边柱子离左边柱子的距离（双柱子的时候）
            barGap: data.barGap ? data.barGap : 10,
            // 单柱子之间的距离
            barCategoryGap: data.barCategoryGap ? data.barCategoryGap : 15,
            label: {
              show: !data.hideSeriLabel,
              position: data.labelPosition ? data.labelPosition[index] : 'outside',
              color: data.seriLabelClr ? data.seriLabelClr[index] : '#21D8FF',
              fontSize: data.seriLabelFS || 12,
              formatter: data.dataType ? (data.dataType === 'percent' ? '{c}%' : '{c}') : '{c}'
            },
            itemStyle: {
              color: data.barColor ? data.barColor : 'auto'
            },
            data: seriesData[index]
          }
        })
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped>

</style>
