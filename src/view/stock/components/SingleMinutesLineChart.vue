<template>
  <div class="single-minutes-chart">
    <echarts :options="options">

    </echarts>
  </div>
</template>

<script>
import Echarts from '../../../components/Echarts'
import {timeXData} from '../js/xAxisData'
import moment from 'moment'
export default {
  name: 'SingleMinutesLineChart',
  props: {
    currentStock: {
      type: Object,
      required: true
    }
  },
  components: {Echarts},
  data () {
    return {
      options: {},
      chartData: {stockData: {yestclose: 0, data: []}},
      animation: false,
      requestNum: 0,
      currentDay: '2088-08-08',
      timer: null,
      stockChart: null,
      stockDetailData: {}
    }
  },
  computed: {
    tooltipStyle () {
      if (this.stockDetailData.upDownValue > 0) {
        return 'color:#dd2200'
      }
      if (this.stockDetailData.upDownValue === 0) {
        return 'color:gray'
      }
      if (this.stockDetailData.upDownValue < 0) {
        return 'color:#1bb66f'
      }
    }
  },
  created () {
    this.getDetailsData()
    this.getMinutesData()
  },
  mounted () {
    this.initOptions(this.chartData)
  },
  watch: {
    chartData: {
      deep: true,
      handler (newVal) {
        this.$nextTick(function () {
          this.initOptions(newVal)
        })
      }
    }
  },
  methods: {
    getSeriesData (stockData) {
      const xDataArr = [] // 时间轴
      const percentArr = [] // 涨跌幅 数据
      const date = moment(stockData.date).format('YYYY-MM-DD')
      const minutesDataArr = stockData.data
      for (let index = 0; index < timeXData.length; index++) {
        const x = `${date} ${timeXData[index]}`
        xDataArr.push(x)
        const minutesData = minutesDataArr[index]
        const percent = minutesData ? minutesData[4] : null
        percentArr.push(percent)
      }
      return {xDataArr, percentArr}
    },
    getDoubleYInfo (percentArr) {
      // 计算Y轴的最大最小值
      const max = Math.max(...percentArr)
      const min = Math.min(...percentArr)
      return Math.abs(max) > Math.abs(min) ? Math.abs(max) : Math.abs(min)
    },
    initOptions (chartData) {
      const stockData = chartData.stockData
      const {xDataArr, percentArr} = this.getSeriesData(stockData)
      const YMaxValue = this.getDoubleYInfo(percentArr)
      this.options = {
        grid: [
          {
            left: '5%',
            width: '90%',
            right: '5%'
          }
        ],
        xAxis: [
          {
            type: 'category',
            gridIndex: 0,
            boundaryGap: false,
            data: xDataArr,
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },
            axisPointer: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            gridIndex: 0,
            max: YMaxValue,
            min: -YMaxValue,
            interval: YMaxValue / 2,
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisPointer: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '涨跌幅',
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            // 是否显示小点点
            showSymbol: false,
            smooth: 0.1,
            lineStyle: {
              width: 1.5,
              color: 'white'
              // color: this.stockDetailData.upDownValue > 0 ? '#ee4957' : '#01d078'
            },
            data: percentArr
          }
        ]
      }
    },
    getMinutesData () {
      const that = this
      const market = this.currentStock.market
      const id = market === 'sh' ? `0${this.currentStock.code}` : `1${this.currentStock.code}`
      const param = {
        market: 'hs',
        id
      }
      this.$axiosGet('/getminutes', param).then(res => {
        that.chartData.stockData = res.data
      })
    },
    getDetailsData () {
      const that = this
      const market = this.currentStock.market
      const id = market === 'sh' ? `${market}${this.currentStock.code}` : `${market}${this.currentStock.code}`
      const param = {
        id
      }
      this.$axiosGet('/getShareDetailInfo', param).then(res => {
        that.stockDetailData = res.data
      })
    }
  }
}
</script>

<style scoped>
.single-minutes-chart{
  width: 100%;
  height: 100%;
}
</style>
