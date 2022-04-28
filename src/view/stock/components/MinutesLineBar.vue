<template>
  <div class="minutes-wrap">
    <div class="info-wrap">
      <div class="title-wrap">
        <span class="font-size-18">{{ stockData.newestInfo.name }}</span>
        <span style="padding: 0 10px" class="font-size-13">sh{{ stockData.newestInfo.code }}</span>
        <span :style="tooltipStyle" class="font-size-18 font-weight-800">{{ stockData.newestInfo.currentPrice }}</span>
        <span :style="tooltipStyle" class="font-size-10 text-indent-1em">
          {{stockData.newestInfo.upDownValue }} {{ `${stockData.newestInfo.upDownPercent}%` }}
        </span>
        <el-button type="danger" size="mini" class="collect-btn font-size-10">+自选</el-button>
      </div>
      <div class="detail-wrap">
        <div class="detail-info">最高：{{ stockData.newestInfo.highest }}<br>最低：{{ stockData.newestInfo.lowest }}</div>
        <div class="detail-info">
          今开：{{stockData.newestInfo.todayOpenPrice }}
          <br>
          昨收：{{ stockData.newestInfo.yesterdayPrice }}
        </div>
        <div class="detail-info">
          成交量：{{(stockData.newestInfo.volume2 / 100000000).toFixed(2) }}亿手
          <br>
          成交额：{{ (stockData.newestInfo.turnover / 10000).toFixed(2) }}亿
        </div>
        <div class="detail-info">
          总市值：{{ (stockData.newestInfo.marketValue * 1).toFixed(0) }}万亿
          <br>振<span style="display: inline-block;padding-left: 1em"></span>幅：{{ stockData.newestInfo.amplitude }}%
        </div>
      </div>
    </div>
    <div style="height: 40px;background-color: #676767">
      <el-button-group>
        <el-button type="primary" icon="el-icon-edit"></el-button>
        <el-button type="primary" icon="el-icon-share"></el-button>
        <el-button type="primary" icon="el-icon-delete"></el-button>
      </el-button-group>
    </div>
    <div class="chart-wrap">
      <echarts :options="options" style="width: 80%;float: left"></echarts>
      <handicap :newest-info="stockData.newestInfo" style="width: 20%;"/>
    </div>
  </div>
</template>
<script>
import Echarts from '../../../components/Echarts'
import {timeXData} from '../js/xAxisData'
import moment from 'moment'
import Handicap from './Handicap'
import openTimer from '../../../mixins'

export default {
  mixins: [openTimer],
  name: 'LineBar', // 上下两个grid(分时图和量图)
  props: {
    currentStock: {
      type: Object,
      required: true
    }
  },
  components: {Echarts, Handicap},
  data () {
    return {
      options: {},
      stockData: {
        newestInfo: {},
        newestMinutes: []
      },
      animation: false,
      requestNum: 0,
      currentDay: '2088-08-08',
      timer: null,
      stockChart: null
    }
  },
  computed: {
    tooltipStyle () {
      if (this.stockData.newestInfo.upDownValue > 0) {
        return 'color:#ee4957'
      }
      if (this.stockData.newestInfo.upDownValue === 0) {
        return 'color:gray'
      }
      if (this.stockData.newestInfo.upDownValue < 0) {
        return 'color:#01d078'
      }
    }
  },
  created () {

  },
  watch: {
    currentStock: {
      deep: true,
      handler (newVal) {
        this.getMinutesData()
      }
    }
  },
  mounted () {
    this.getMinutesData()
  },
  methods: {
    refreshData () {
      this.getMinutesData()
    },
    getSeriesData (stockData) {
      const xDataArr = [] // 时间轴
      const averagePriceArr = [] // 均价 数据
      const percentArr = [] // 涨跌幅 数据
      const focusPoint = [[null, null]] // 最新涨跌幅位置
      const volumeArr = [] // 成交量（手）
      const yestClosePrice = stockData.yestclose // 昨天收盘价
      const date = moment().format('YYYY-MM-DD')
      const minutesDataArr = stockData.newestMinutes
      for (let index = 0; index < timeXData.length; index++) {
        const x = `${date} ${timeXData[index]}`
        xDataArr.push(x)
        const minutesData = minutesDataArr[index]
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
          if (index === 120 || index === 240 || index === 241) {
            focusPoint[0][0] = null
            focusPoint[0][1] = null
          }
        }
      }
      const param = {xDataArr, yestClosePrice, averagePriceArr, percentArr, focusPoint, volumeArr}
      console.log(param)
      return param
    },
    getDoubleYInfo (percentArr, yestClosePrice) {
      // 计算两边Y轴的最大最小值
      const max = Math.max(...percentArr)
      const min = Math.min(...percentArr)
      const rightYMaxValue = Math.abs(max) > Math.abs(min) ? Math.abs(max) : Math.abs(min)
      const leftYMaxValue = yestClosePrice * (1 + (rightYMaxValue / 100)).toFixed(2)
      const leftYMinValue = yestClosePrice * (1 - (rightYMaxValue / 100)).toFixed(2)
      return {rightYMaxValue, leftYMaxValue, leftYMinValue}
    },
    initOptions (stockData) {
      const {
        xDataArr,
        yestClosePrice,
        averagePriceArr,
        percentArr,
        focusPoint,
        volumeArr
      } = this.getSeriesData(stockData)
      const {rightYMaxValue, leftYMaxValue, leftYMinValue} = this.getDoubleYInfo(percentArr, yestClosePrice)
      this.options = {
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: (params) => {
            const arr = params.sort((a, b) => {
              return a.seriesIndex - b.seriesIndex
            })
            let html = '<div>' + moment(arr[0].axisValue).format('YYYY-MM-DD HH:mm') + '</div>'
            const value1 = arr[0].value ? (arr[0].value * 1).toFixed(2) : '-'
            const value2 = arr[1].value ? arr[1].value : '-'
            const value3 = arr[2].value ? (arr[2].value * 1).toFixed(2) : '-'
            const percentText = '<div style="text-align: left">' + arr[0].marker + arr[0].seriesName + ':' + value1 + '%</div>'
            const volumeText = '<div style="text-align: left">' + arr[1].marker + arr[1].seriesName + ':' + value2 + '手</div>'
            const averagePriceText = '<div style="text-align: left">' + arr[2].marker + arr[2].seriesName + ':' + value3 + '</div>'
            return html + percentText + volumeText + averagePriceText
          }
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
            left: 0,
            top: 20,
            width: '100%',
            height: '50%'
          },
          {
            containLabel: false,
            left: 0,
            right: 50,
            width: '100%',
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
              show: true,
              label: {
                formatter: series => {
                  return moment(series.value).format('HH:mm')
                }
              }
            },
            data: xDataArr
          },
          {
            type: 'value',
            gridIndex: 0,
            z: 1,
            boundaryGap: false,
            position: 'bottom',
            data: [1, 2, 3, 4, 5],
            min: 1,
            max: 5,
            interval: 1,
            axisLabel: {
              show: true,
              color: '#ccc',
              formatter: function (value) {
                if (value === 1) return '{right|09:30}'
                if (value === 2) return '10:30'
                if (value === 3) return '11:30/13:00'
                if (value === 4) return '14:00'
                if (value === 5) return '{left|15:00}'
              },
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
              show: true,
              label: {
                backgroundColor: 'transparent',
                formatter: series => {
                  return ''
                }
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            gridIndex: 0,
            min: leftYMinValue,
            max: leftYMaxValue,
            interval: (leftYMaxValue - leftYMinValue) / 4,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#1e3139'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#1e3139'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#ccc',
              inside: true,
              formatter: function (value) {
                return value.toFixed(2)
              }
            },
            axisPointer: {
              show: true,
              label: {
                formatter: series => {
                  return series.value ? series.value.toFixed(2) : ''
                }
              }
            }
          },
          {
            type: 'value',
            gridIndex: 0,
            max: rightYMaxValue,
            min: -rightYMaxValue,
            interval: rightYMaxValue / 2,
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
              color: '#ccc',
              formatter: function (value) {
                return `${value.toFixed(2)}%`
              },
              inside: true
            },
            axisPointer: {
              show: true,
              label: {
                formatter: series => {
                  return series.value ? series.value.toFixed(2) + '%' : ''
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
              show: false,
              label: {
                formatter: series => {
                  return series.value ? series.value + '(手)' : ''
                }
              }
            }
          }
        ],
        series: [

          {
            name: '涨跌幅',
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 1,
            // 是否显示小点点
            showSymbol: false,
            //
            smooth: 0.1,
            lineStyle: {
              width: 1.5,
              color: this.stockData.newestInfo.upDownValue > 0 ? '#ee4957' : '#01d078'
            },
            areaStyle: {
              color: this.stockData.newestInfo.upDownValue > 0 ? '#ee4957' : '#01d078',
              origin: 'start',
              opacity: 0.1
            },
            // data:[ [xValue,yValue]]
            data: percentArr
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
    },
    getMinutesData () {
      const that = this
      const stock = this.currentStock
      this.$axiosGet(`/${stock.market}/quey/minutes/${stock.id}`).then(res => {
        that.stockData = res.data
      }).finally(() => {
        this.$nextTick(function () {
          this.initOptions(that.stockData)
        })
        if (this.timer) {
          setTimeout(function () {
            that.refreshData()
          }, 5000)
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.minutes-wrap {
  background-color: #161a23;
  border-radius: 5px;
  height: calc(100% - 16px);
  margin: 8px 4px;
}

.minutes-wrap:before, .minutes-wrap:after {
  content: '';
  display: block;
  clear: both;
}

.minutes-wrap > div {
  float: left;
  width: 100%;
}

.minutes-wrap .info-wrap {
  color: #c7c6c6;
  padding: 0 12px;
  box-sizing: border-box;
}

.title-wrap {
  position: relative;
  height: 30px;
  text-align: left;
}

.title-wrap span {
  display: inline-block;
  line-height: 30px;
}

.title-wrap .collect-btn {
  position: absolute;
  right: 8px;
}

.detail-info {
  float: left;
  height: 32px;
  width: 25%;
  font-size: 12px;
  text-align: left;
}

.chart-wrap {
  width: 100%;
  height: calc(100% - 102px);
}

</style>
