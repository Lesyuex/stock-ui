<template>
  <div style="width: 100%;height: 100%;position: relative">
    <echarts :options="options"/>
    <el-icon class="el-icon-loading" style="position: absolute;top:30%;left:calc(50% - 15px);font-size: 30px" v-if="loadingData"/>
  </div>
</template>
<script>
import Echarts from './Echarts'
import {timeHkXData, timeXData} from '../../view/stock/js/xAxisData'
import moment from 'moment'

export default {
  name: 'MinutesChart', // 上下两个grid(分时图和量图)
  props: {
    marketCode: String,
    stockData: {
      type: Object,
      required: true
    }
  },
  components: {
    Echarts
  },
  data () {
    return {
      loadingData: true,
      options: {},
      currentDay: '2088-08-08',
      marketOptions: [
        {
          prefix: 'sh,sz',
          bottomX: [1, 2, 3, 4, 5],
          max: 5,
          xFormatter: function (value) {
            if (value === 1) return '{right|09:30}'
            if (value === 2) return '10:30'
            if (value === 3) return '11:30/13:00'
            if (value === 4) return '14:00'
            if (value === 5) return '{left|15:00}'
          },
          timeXData: timeXData
        },
        {
          prefix: 'hk',
          bottomX: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          max: 12,
          xFormatter: function (value) {
            if (value === 1) return '{right|09:30}'
            if (value === 3) return '10:30'
            if (value === 6) return '12:00/13:00'
            if (value === 8) return '14:00'
            if (value === 10) return '15:00'
            if (value === 12) return '{left|16:00}'
          },
          timeXData: timeHkXData
        }]
    }
  },
  watch: {
    stockData: {
      deep: true,
      handler () {
        this.initOptions()
      }
    }
  },
  computed: {
    marketIndex () {
      const prefix = this.marketCode.substr(0, 2)
      for (let i = 0; i < this.marketOptions.length; i++) {
        if (this.marketOptions[i].prefix.indexOf(prefix) > -1) {
          return i
        }
      }
    },
    upDownColor () {
      const value = this.stockData.newestInfo.upDownValue
      if (value > 0) return '#ee4957'
      if (value < 0) return '#01d078'
      return null
    },
    tooltipFormatter () {
      return (params) => {
        let html = '<div>' + moment(params[0].axisValue).format('YYYY-MM-DD HH:mm') + '</div>'
        const dataIndex = params[0].dataIndex
        const currentMinu = this.stockData.newestMinutes[dataIndex]
        // 价格
        const marker1 = '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:gold;"></span>'
        const currentPrice = currentMinu && currentMinu[1] ? currentMinu[1] : '-'
        const priceText = `<div style="text-align: left">${marker1}价格：${currentPrice}</div>`
        // 涨跌幅
        const percent = currentMinu && currentMinu[6] ? currentMinu[6] : '-'
        let color
        if (percent > 0) {
          color = '#ee4957'
        } else if (percent < 0) {
          color = '#01d078'
        } else {
          color = 'gray'
        }
        const marker2 = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`
        const percentText = `<div style="text-align: left">${marker2}涨幅：${percent}%</div>`
        // 均价
        const marker3 = '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#ff9e12;"></span>'
        const average = currentMinu && currentMinu[5] ? currentMinu[5] : '-'
        const averagePriceText = `<div style="text-align: left">${marker3}均价：${average}</div>`
        // 成交量
        const marker4 = '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0091fc;"></span>'
        const volume = currentMinu && currentMinu[4] ? currentMinu[4] : '-'
        const volumeText = `<div style="text-align: left">${marker4}成交量：${volume}手</div>`
        return html + priceText + percentText + averagePriceText + volumeText
      }
    }
  },
  mounted () {
    this.initOptions()
  },
  methods: {
    getSeriesData (stockData) {
      const xDataArr = [] // 时间轴
      const priceArr = []
      const averagePriceArr = [] // 均价 数据
      const percentArr = [] // 涨跌幅 数据
      const focusPoint = [[null, null]] // 最新涨跌幅位置
      const volumeArr = [] // 成交量（手）
      const date = moment().format('YYYY-MM-DD')
      const minutesDataArr = stockData.newestMinutes
      const xData = this.marketOptions[this.marketIndex].timeXData
      for (let index = 0; index < xData.length; index++) {
        const x = `${date} ${xData[index]}`
        xDataArr.push(x)
        const minutesData = minutesDataArr[index]
        // 当前价
        priceArr.push(minutesData ? minutesData[1] : null)
        // 均价,成交量和涨跌幅
        const averagePrice = minutesData ? minutesData[5] : null
        averagePriceArr.push(averagePrice)
        const volume = minutesData ? minutesData[4] : null
        volumeArr.push(volume)
        const percent = minutesData ? minutesData[6] : null
        percentArr.push(percent)
        // 光圈处于最新涨跌幅位置
        if (percent) {
          focusPoint[0][0] = index
          focusPoint[0][1] = percent
          if (index === xData.length - 1) {
            focusPoint[0][0] = null
            focusPoint[0][1] = null
          }
        }
      }
      return {xDataArr, priceArr, averagePriceArr, percentArr, focusPoint, volumeArr}
    },
    initOptions () {
      const stockData = this.stockData
      const {
        xDataArr,
        priceArr,
        averagePriceArr,
        percentArr,
        focusPoint,
        volumeArr
      } = this.getSeriesData(stockData)
      this.options = {
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: this.tooltipFormatter
        },
        axisPointer: {
          show: true,
          triggerTooltip: false,
          link: [
            {
              xAxisIndex: [0, 2]
            },
            {
              yAxisIndex: [0, 1, 2]
            }
          ]
        },
        grid: [
          {
            containLabel: false,
            left: 'center',
            top: 20,
            width: '98%',
            height: '56%'
          },
          {
            containLabel: false,
            left: 'center',

            width: '98%',
            height: '20%',
            bottom: 8
          }
        ],
        xAxis: [
          {
            type: 'category',
            gridIndex: 0,
            z: 2,
            boundaryGap: false,
            axisLabel: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },
            axisTick: {
              show: false
            },
            axisPointer: {
              show: true
            },
            data: xDataArr
          },
          {
            type: 'value',
            gridIndex: 0,
            z: 1,
            boundaryGap: false,
            position: 'bottom',
            data: this.marketOptions[this.marketIndex].bottomX,
            min: 1,
            max: this.marketOptions[this.marketIndex].max,
            interval: 1,
            axisLabel: {
              show: true,
              color: '#858585',
              formatter: this.marketOptions[this.marketIndex].xFormatter,
              rich: {
                right: {
                  padding: [0, 0, 0, 30]
                },
                left: {
                  padding: [0, 45, 0, 0]
                }
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#1e3139'
              }
            },
            axisTick: {
              show: true
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
          },
          {
            type: 'category',
            gridIndex: 1,
            boundaryGap: false,
            data: xDataArr,
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisPointer: {
              show: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            gridIndex: 0,
            min: this.stockData.y1MinValue,
            max: this.stockData.y1MaxValue,
            interval: (this.stockData.y1MaxValue - this.stockData.y1MinValue) / 4,
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
              color: 'rgba(255,255,255,0.4)',
              inside: true,
              margin: -4,
              formatter: function (value) {
                return value.toFixed(2)
              }
            },
            axisPointer: {
              show: true,
              label: {
                formatter: series => {
                  return series.value.toFixed(2)
                }
              }
            }
          },
          {
            type: 'value',
            gridIndex: 0,
            max: this.stockData.y2MaxValue,
            min: -this.stockData.y2MaxValue,
            interval: this.stockData.y2MaxValue / 2,
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
              margin: -4,
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
          },
          {
            type: 'value',
            gridIndex: 1,
            min: 0,
            max: function (data) {
              return data.max
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisPointer: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '当前价',
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            // 是否显示小点点
            showSymbol: false,
            //
            smooth: 0.1,
            lineStyle: {
              width: 1.5,
              color: this.upDownColor
            },
            areaStyle: {
              color: this.upDownColor,
              origin: 'start',
              opacity: 0.1
            },
            // data:[ [xValue,yValue]]
            data: priceArr
          },
          // 成交量
          {
            name: '成交量',
            type: 'bar',
            // 以哪个y轴为参考线
            xAxisIndex: 2,
            yAxisIndex: 2,
            // 关掉y轴小圆圈
            showSymbol: false,
            // 折线参数
            lineStyle: {
              color: '#ffe459',
              width: 2
            },
            // data:[ [xValue,yValue]]
            data: volumeArr.map((volume, index) => {
              const value = volume
              const itemStyle = {
                color: ''
              }
              if (index === 0) {
                itemStyle.color = percentArr[index] > 0 ? '#ee4957' : '#01d078'
              } else {
                itemStyle.color = percentArr[index] > percentArr[index - 1] ? '#ee4957' : '#01d078'
              }
              return {value, itemStyle}
            })
          },
          {
            name: '均价',
            type: 'line',
            // 以哪个y轴为参考线
            xAxisIndex: 0,
            yAxisIndex: 0,
            // 关掉y轴小圆圈
            showSymbol: false,
            // 折线参数
            lineStyle: {
              color: '#ff9e12',
              width: 1
            },
            // data:[ [xValue,yValue]]
            data: averagePriceArr
          },
          {
            name: '光圈',
            type: 'effectScatter',
            effectType: 'ripple',
            xAxisIndex: 0,
            yAxisIndex: 1,
            symbolSize: 3,
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

        ]
      }
    }
  }
}
</script>
