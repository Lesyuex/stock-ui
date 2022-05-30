<template>
  <div>
    <echarts :options="options"/>
    <c-icon
      :name="'loading-one'"
      class="test"
      v-if="loadingData"
      style="position: absolute;top:30%;left:calc(50% - 15px);font-size: 30px"/>
  </div>
</template>

<script>
import {aStockAxisData} from '../../static/js/axisData'
import {tooltipFormatter} from '../../static/js/echartsOption'
import Echarts from './Echarts'
import openTimer from '../../mixins'
export default {
  props: {
    marketCode: String
  },
  components: {
    Echarts
  },
  mixins: [openTimer],
  name: 'FiveDayChart',
  data () {
    return {
      aStockAxisData,
      tooltipFormatter,
      loadingData: false,
      stockData: {},
      options: {},
      axis: null
    }
  },
  created () {
    this.refreshData()
  },
  methods: {
    refreshData () {
      this.getFiveDayK()
    },
    getFiveDayK () {
      const that = this
      this.$axiosGet(`/k/get/fiveday/line/${this.marketCode}`).then(res => {
        this.stockData = res.data
      }).finally(() => {
        this.initSeriesData()
        if (this.timer) {
          window.clearTimeout(that.timer)
          that.timer = setTimeout(function () {
            that.refreshData()
          }, 2000)
        }
      })
    },
    initSeriesData () {
      const xAxisArr = [] // 1-5grid的真实x轴
      const helpXArr = [] // 1-5grid存放日期的x轴
      const yAxisArr = [] // 1-5grid的y轴
      const volumeXArr = [] // 6-10grid的x轴
      const volumeYArr = [] // 6-10grid的y轴
      // 上部分的series数据
      const priceSeriesArr = []
      // 下部分的series数据
      const volumeSeriesArr = []
      const focusPoint = [[null, null]] // 最新涨跌幅位置
      for (let i = 0; i < this.stockData.fiveday.length; i++) {
        const day = this.stockData.fiveday[4 - i]
        const date = day.date
        const x = {
          type: 'category',
          gridIndex: i,
          position: 'top',
          boundaryGap: false,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisPointer: {
            show: true
          },
          data: this.aStockAxisData
        }
        const y = {
          type: 'value',
          gridIndex: i,
          min: this.stockData.minYaxisPrice,
          max: this.stockData.maxYaxisPrice,
          interval: (this.stockData.maxYaxisPrice - this.stockData.minYaxisPrice) / 4,
          axisLine: {
            show: false,
            lineStyle: {
              color: '#1e3139'
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(0,0,0,0.3)'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: i === 0,
            color: 'rgba(255,255,255,0.4)',
            inside: true,
            margin: 0,
            formatter: function (value) {
              return value.toFixed(2)
            }
          },
          axisPointer: {
            show: true,
            label: {
              formatter: series => {
                return i === 0 ? series.value.toFixed(2) : null
              },
              backgroundColor: i !== 0 ? 'transparent' : null
            }
          }
        }
        xAxisArr.push(x)
        yAxisArr.push(y)

        const helpX = {
          type: 'value',
          gridIndex: i,
          boundaryGap: false,
          position: 'bottom',
          data: [1, 2, 3],
          min: 1,
          max: 3,
          interval: 1,
          axisLabel: {
            show: true,
            // inside: true,
            color: '#858585',
            margin: -12,
            lineHeight: 50,
            formatter: function (value) {
              if (value === 2) {
                return date
              }
              return null
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0,0,0,.1)'
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(0,0,0,0.3)'
            }
          },
          axisPointer: {
            show: false
          }
        }
        helpXArr.push(helpX)

        const volumeX = {
          type: 'category',
          gridIndex: i + 5,
          boundaryGap: false,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisPointer: {
            show: true
          },
          data: this.aStockAxisData
        }
        const volumeY = {
          type: 'value',
          gridIndex: i + 5,
          min: 0,
          max: this.stockData.maxVolume,
          interval: this.stockData.maxVolume / 4,
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            margin: 0
          },
          axisPointer: {
            show: true,
            label: {
              formatter: series => {
                return i === 0 ? series.value.toFixed(2) : null
              },
              backgroundColor: i !== 0 ? 'transparent' : null
            }
          }
        }
        volumeXArr.push(volumeX)
        volumeYArr.push(volumeY)

        const volumeArr = []
        const averageArr = []
        const priceArr = day.minutesVoList.map(minu => {
          minu.value = minu.price
          minu.date = `${date} ${minu.time}`
          averageArr.push(minu.averagePrice)
          volumeArr.push(minu.minuVolume)
          if (i === 4) {
            // 光圈处于最新涨跌幅位置
            if (minu.value) {
              if (!this.stockData.marketOpen) {
                focusPoint[0][0] = null
                focusPoint[0][1] = null
              } else {
                focusPoint[0][0] = minu.time
                focusPoint[0][1] = minu.value
              }
            }
          }
          return minu
        })
        const priceSeries = {
          name: '价格',
          type: 'line',
          xAxisIndex: i,
          yAxisIndex: i,
          // 是否显示小点点
          showSymbol: false,
          // 表示平滑程度，越小表示越接近折线段，反之则反。设为 true 时相当于设为 0.5
          smooth: 0.1,
          lineStyle: {
            width: 1.5,
            color: this.$store.getters.lineColor
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: this.$store.getters.lineColor // 0% 处的颜色
              }, {
                offset: 1, color: '#161a23' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            origin: 'start',
            opacity: 0.1
          },
          markLine: {
            symbol: 'none',
            label: {show: false},
            lineStyle: {
              type: 'dashed',
              color: '#ccc'
            },
            emphasis: {
              // 关闭高亮
              disabled: true
            },
            data: [
              {
                yAxis: this.stockData.beginPrice
              }
            ]
          },
          data: priceArr
        }
        const averageSeries = {
          name: '均价',
          type: 'line',
          xAxisIndex: i,
          yAxisIndex: i,
          // 关掉y轴小圆圈
          showSymbol: false,
          lineStyle: {
            color: '#ff9e12',
            width: 1
          },
          data: averageArr
        }
        priceSeriesArr.push(priceSeries)
        priceSeriesArr.push(averageSeries)
        // x坐标10 11 12 13 14
        // y坐标5 6 7 8 9
        const volume = {
          name: '成交量',
          type: 'bar',
          // 以哪个y轴为参考线
          xAxisIndex: i + 10,
          yAxisIndex: i + 5,
          // 关掉y轴小圆圈
          showSymbol: false,
          // 折线参数
          lineStyle: {
            color: '#ffe459',
            width: 2
          },
          data: volumeArr.map((volume, index) => {
            const value = volume
            const itemStyle = {
              color: ''
            }
            if (index === 0) {
              itemStyle.color = priceArr[index].value > 0 ? '#ee4957' : '#01d078'
            } else {
              itemStyle.color = priceArr[index].value > priceArr[index - 1].value ? '#ee4957' : '#01d078'
            }
            return {value, itemStyle}
          })
        }
        volumeSeriesArr.push(volume)
      }
      const newXdata = xAxisArr.concat(helpXArr).concat(volumeXArr)
      // 百分比y轴 放在第五个grid
      const percentY = {
        type: 'value',
        gridIndex: 4,
        max: this.stockData.maxYaxisPercent,
        min: -this.stockData.maxYaxisPercent,
        interval: this.stockData.maxYaxisPercent / 2,
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#1e3139'
          }
        },
        axisLabel: {
          color: 'rgba(255,255,255,0.4)',
          margin: 0,
          formatter: function (value) {
            return `${value.toFixed(2)}%`
          },
          inside: true
        },
        axisPointer: {
          show: true,
          label: {
            formatter: series => {
              return series.value.toFixed(2) + '%'
            }
          }
        }
      }
      const newYdata = yAxisArr.concat(volumeYArr).concat(percentY)
      const focu = {
        name: '光圈',
        type: 'effectScatter',
        effectType: 'ripple',
        xAxisIndex: 4,
        yAxisIndex: 4,
        symbolSize: 2,
        rippleEffect: {
          color: '#24e5ee', // 涟漪的颜色
          number: 2, // 波纹数量
          period: 2, // 动画周期
          scale: 6 // 缩放比例
        },
        itemStyle: {
          color: '#24e5ee' // 颜色
        },
        // data:[ [xValue,yValue]]
        data: focusPoint
      }
      const seriesArr = priceSeriesArr.concat(volumeSeriesArr).concat([focu])
      this.axis = {xAxisArr: newXdata, yAxisArr: newYdata, seriesArr: seriesArr}
      this.initOptions()
    },
    initOptions () {
      this.options = {
        animation: false,
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: this.tooltipFormatter
        },
        axisPointer: {
          show: true,
          triggerTooltip: false,
          lineStyle: {
            type: 'solid'
          },
          link: [
            {xAxisIndex: [0, 10]},
            {xAxisIndex: [1, 11]},
            {xAxisIndex: [2, 12]},
            {xAxisIndex: [3, 13]},
            {xAxisIndex: [4, 14]},
            {yAxisIndex: [0, 1, 2, 3, 4]},
            {yAxisIndex: [5, 6, 7, 8, 9]}
          ]
        },
        grid: [
          // 上
          {
            containLabel: true,
            left: '0%',
            top: 20,
            width: '20%',
            height: '68%'
          },
          {
            containLabel: true,
            left: '20%',
            top: 20,
            width: '20%',
            height: '68%'
          },
          {
            containLabel: true,
            left: '40%',
            top: 20,
            width: '20%',
            height: '68%'
          },
          {
            containLabel: true,
            left: '60%',
            top: 20,
            width: '20%',
            height: '68%'
          },
          {
            containLabel: true,
            left: '80%',
            top: 20,
            width: '20%',
            height: '68%'
          },

          // 下
          {
            containLabel: true,
            left: '0%',
            top: '70%',
            width: '20%',
            height: '30%'
          },
          {
            containLabel: true,
            left: '20%',
            top: '70%',
            width: '20%',
            height: '30%'
          },
          {
            containLabel: true,
            left: '40%',
            top: '70%',
            width: '20%',
            height: '30%'
          },
          {
            containLabel: true,
            left: '60%',
            top: '70%',
            width: '20%',
            height: '30%'
          },
          {
            containLabel: true,
            left: '80%',
            top: '70%',
            width: '20%',
            height: '30%'
          }
        ],
        xAxis: this.axis.xAxisArr,
        yAxis: this.axis.yAxisArr,
        series: this.axis.seriesArr
      }
    }
  }
}
</script>

<style scoped>
  div{
    width: 100%;
    height: 100%;
  }
</style>
