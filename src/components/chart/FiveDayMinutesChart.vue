<template>
  <div>
    <echarts :options="options"/>
  </div>
</template>

<script>
import {aStockAxisData} from '../../static/js/axisData'
import Echarts from './Echarts'
import moment from 'moment'
export default {
  props: {
    marketCode: String
  },
  components: {
    Echarts
  },
  name: 'FiveDayChart',
  data () {
    return {
      aStockAxisData,
      stockData: {},
      options: {},
      axis: null
    }
  },
  created () {
    this.refreshData()
  },
  computed: {
    tooltipFormatter () {
      return (params) => {
        const data = params[0].data || {}
        // 涨跌幅
        const date = data.date || '2088-08-08 08:08'
        let html = '<div>' + moment(date).format('YYYY-MM-DD HH:mm') + '</div>'
        // 价格
        const marker1 = '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:gold;"></span>'
        const currentPrice = data.price || '-'
        const priceText = `<div style="text-align: left">${marker1}价格：${currentPrice}</div>`
        // 涨跌幅
        const percent = data.percent || '-'
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
        const average = data.averagePrice || '-'
        const averagePriceText = `<div style="text-align: left">${marker3}均价：${average}</div>`
        // 成交量
        const marker4 = '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0091fc;"></span>'
        const volume = data.volume || '-'
        const volumeText = `<div style="text-align: left">${marker4}成交量：${volume}手</div>`
        return html + priceText + percentText + averagePriceText + volumeText
      }
    }
  },
  methods: {
    refreshData () {
      this.getFiveDayK()
    },
    getFiveDayK () {
      this.$axiosGet(`/k/get/fiveday/line/${this.marketCode}`).then(res => {
        this.stockData = res.data
      }).finally(() => {
        this.initSeriesData()
      })
    },
    initSeriesData () {
      const xAxisArr = []
      const helpXArr = []
      const yAxisArr = []
      const volumeXArr = []
      const volumeYArr = []
      const seriesArr = []
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
          min: this.stockData.minValue,
          max: this.stockData.maxValue,
          interval: (this.stockData.maxValue - this.stockData.minValue) / 4,
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
            margin: -4,
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
            color: '#858585',
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
        }
        helpXArr.push(helpX)

        const volumeX = {
          type: 'category',
          gridIndex: i + 5,
          position: 'bottom',
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
            show: false
          },
          data: this.aStockAxisData
        }
        const volumeY = {
          type: 'value',
          gridIndex: i + 5,
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
            show: false
          },
          axisPointer: {
            show: false
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
          return minu
        })
        const price = {
          name: '价格',
          type: 'line',
          xAxisIndex: i,
          yAxisIndex: i,
          // 是否显示小点点
          showSymbol: false,
          // 表示平滑程度，越小表示越接近折线段，反之则反。设为 true 时相当于设为 0.5
          smooth: 0.1,
          lineStyle: {
            width: 1.5
            // color: this.upDownColor
          },
          areaStyle: {
            // color: this.upDownColor,
            origin: 'start',
            opacity: 0.1
          },
          data: priceArr
        }
        const averagePrice = {
          name: '均价',
          type: 'line',
          // 以哪个y轴为参考线
          xAxisIndex: i,
          yAxisIndex: i,
          // 关掉y轴小圆圈
          showSymbol: false,
          // 折线参数
          lineStyle: {
            color: '#ff9e12',
            width: 1
          },
          data: averageArr
        }
        seriesArr.push(price)
        seriesArr.push(averagePrice)
        // 成交量
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
        seriesArr.push(volume)
      }
      const newXdata = xAxisArr.concat(helpXArr).concat(volumeXArr)
      const newYdata = yAxisArr.concat(volumeYArr)
      this.axis = {xAxisArr: newXdata, yAxisArr: newYdata, seriesArr}
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
          link: [
            {xAxisIndex: [0, 10]}, {xAxisIndex: [1, 11]}, {xAxisIndex: [2, 12]}, {xAxisIndex: [3, 13]}, {xAxisIndex: [4, 14]},
            {yAxisIndex: [0, 1, 2, 3, 4]}
          ]
        },
        grid: [
          // 上
          {
            containLabel: false,
            left: '2%',
            top: 20,
            width: '19%',
            height: '56%'
          },
          {
            containLabel: false,
            left: '21%',
            top: 20,
            width: '19%',
            height: '56%'
          },
          {
            containLabel: false,
            left: '40%',
            top: 20,
            width: '19%',
            height: '56%'
          },
          {
            containLabel: false,
            left: '59%',
            top: 20,
            width: '19%',
            height: '56%'
          },
          {
            containLabel: false,
            left: '78%',
            top: 20,
            width: '19%',
            height: '56%'
          },

          // 下
          {
            containLabel: false,
            left: '2%',
            bottom: 8,
            width: '19%',
            height: '20%'
          },
          {
            containLabel: false,
            left: '21%',
            bottom: 8,
            width: '19%',
            height: '20%'
          },
          {
            containLabel: false,
            left: '40%',
            bottom: 8,
            width: '19%',
            height: '20%'
          },
          {
            containLabel: false,
            left: '59%',
            bottom: 8,
            width: '19%',
            height: '20%'
          },
          {
            containLabel: false,
            left: '78%',
            bottom: 8,
            width: '19%',
            height: '20%'
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
