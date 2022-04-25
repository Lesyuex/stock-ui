<template>
  <div style="width: 100%;height: 100%;">
    <echarts :options="option"/>
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
        color: data.color || ['#5485E8', '#59D7A5'],
        title: {
          text: data.chartTitle || '',
          top: data.chartTitleTop || 4,
          left: data.chartTitleLeft || 0,
          textStyle: {
            align: 'center',
            color: data.chartTitleColor || '#fff',
            fontSize: data.chartTitleFontSize || 16,
            fontWeight: 400
          }
        },
        legend: {
          show: data.legendShow,
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
          show: data.openTooltip,
          trigger: data.trigger || 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          width: '90%',
          bottom: data.containLabel ? data.gridBottom ? data.gridBottom : 2 : data.gridBottom || 35,
          left: data.containLabel ? data.gridLeft ? data.gridLeft : 2 : data.gridLeft || 55,
          right: data.gridRight ? data.gridRight : 0,
          top: data.gridTop || 70,
          containLabel: data.containLabel || false
        },
        xAxis: {
          show: data.xAxisVisible || true,
          type: 'category',
          data: data.xAxisData,
          fontSize: data.xFontSize || 16,
          axisLine: {
            show: data.xAxisLineVisible || true
          },
          axisLabel: {
            show: data.xAxisLabelVisible || true,
            color: data.xAxisLabelColor
          },
          splitLine: {
            show: data.xSplitLineVisible || false
          },
          axisTick: {
            show: data.xAxisTickVisible || false
          }
        },
        yAxis: {
          show: data.yAxisVisible || true,
          type: 'value',
          fontSize: data.yFontSize || 16,
          axisLine: {
            show: data.yAxisLineVisible || false
          },
          axisLabel: {
            show: data.yAxisLabelVisible || false
          },
          splitLine: {
            show: data.ySplitLineVisible || false
          },
          axisTick: {
            show: data.yAxisTickVisible || false
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
        const series = data.seriesNameArr.map((name, index) => {
          return {
            name: name || '',
            // eslint-disable-next-line valid-typeof
            type: data.seriesType ? data.seriesType[index] : 'bar',
            // 左边放数值，右边放百分比
            yAxisIndex: data.doubleYLine ? (data.seriesType[index] === 'bar' ? 0 : 1) : 0,
            symbol: 'circle',
            symbolSize: data.symbolSize ? data.symbolSize : seriesData[index].length === 1 ? 5 : 0,
            barWidth: data.barWidth ? data.barWidth : null,
            barMaxWith: data.barMaxWith ? data.barMaxWith : 50,
            // 右边柱子离左边柱子的距离（双柱子的时候）
            barGap: data.barGap ? data.barGap : 10,
            // 单柱子之间的距离
            barCategoryGap: data.barCategoryGap ? data.barCategoryGap : null,
            label: {
              show: data.labelPosition ? !!data.labelPosition[index] : true,
              position: data.labelPosition ? data.labelPosition[index] : 'outside',
              color: data.labelColor ? data.labelColor[index] : '#21D8FF',
              fontSize: data.labelFont || 14,
              formatter: data.dataType ? (data.dataType === 'percent' ? '{c}%' : '{c}') : '{c}'
            },
            itemStyle: {
              color: data.barColor ? data.barColor : 'auto'
            },
            data: seriesData[index]
          }
        })
        return series
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped>

</style>
