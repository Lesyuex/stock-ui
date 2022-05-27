<template>
  <div  class="minutes-wrap">
    <echarts :options="options"/>
    <c-icon
      :name="'loading-one'"
      class="test"
      v-if="loadingData"
      style="position: absolute;top:30%;left:calc(50% - 15px);font-size: 30px"
    ></c-icon>
    <div class="select-wrap">
      {{value}}&nbsp;<i class="el-icon-caret-bottom"></i>
      <ul >
        <li v-for="(item,index) in selectArr" @click="selectFn(item)" :style="{color:item === value ? '#708bf5': '#ccc'}" :key="index">{{item}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import Echarts from './Echarts'
import {cnXData, hkXData} from '../../view/stock/js/xAxisData'
import moment from 'moment'
import {tooltipFormatter} from '../../static/js/echartsOption'

export default {
  name: 'MinutesChart', // 上下两个grid(分时图和量图)
  props: {
    marketCode: String,
    stock: {
      type: Object,
      required: true
    }
  },
  components: {
    Echarts
  },
  data () {
    return {
      selectArr: ['成交量', 'MACD'],
      value: '成交量',
      loadingData: true,
      today: moment().format('YYYY-MM-DD'),
      options: {},
      marketOptions: {
        cn: {
          helpXData: [1, 2, 3, 4, 5],
          max: 5,
          xFormatter: function (value) {
            if (value === 1) return '{right|09:30}'
            if (value === 2) return '10:30'
            if (value === 3) return '11:30/13:00'
            if (value === 4) return '14:00'
            if (value === 5) return '{left|15:00}'
          },
          xData: cnXData
        },
        hk: {
          helpXData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          max: 12,
          xFormatter: function (value) {
            if (value === 1) return '{right|09:30}'
            if (value === 3) return '10:30'
            if (value === 6) return '12:00/13:00'
            if (value === 8) return '14:00'
            if (value === 10) return '15:00'
            if (value === 12) return '{left|16:00}'
          },
          xData: hkXData
        }
      }
    }
  },
  watch: {
    stock: {
      deep: true,
      handler () {
        this.initOptions()
      }
    }
  },
  computed: {
    defaultOption () {
      const prefix = this.marketCode.substr(0, 2)
      let market
      if ('sh,sz'.indexOf(prefix) > -1) {
        market = 'cn'
      } else if ('hk'.indexOf(prefix) > -1) {
        market = 'hk'
      }
      return market ? this.marketOptions[market] : null
    },
    upDownColor () {
      const value = this.stock.upDownValue
      return value > 0 ? '#ee4957' : '#01d078'
    }
  },
  mounted () {
    this.initOptions()
  },
  methods: {
    selectFn (item) {
      this.value = item
    },
    getSeriesData (stock) {
      const priceArr = []
      const averagePriceArr = [] // 均价 数据
      const percentArr = [] // 涨跌幅 数据
      const focusPoint = [[null, null]] // 最新涨跌幅位置
      const volumeArr = [] // 成交量（手）
      // 根据当前股票代码获取初始化信息
      const xData = this.defaultOption.xData
      const minutesDataArr = stock.minutesList

      for (let index = 0; index < xData.length; index++) {
        const minutesData = minutesDataArr[index] || {}
        // 当前价
        minutesData.value = minutesData.price
        minutesData.date = `${this.today} ${xData[index]}`
        priceArr.push(minutesData)
        // 均价,成交量和涨跌幅
        averagePriceArr.push(minutesData.averagePrice || null)
        volumeArr.push(minutesData.minuVolume || null)
        // 用于判断能量柱颜色
        percentArr.push(minutesData.percent || null)
        // 光圈处于最新涨跌幅位置
        if (stock.status === 'is_close') {
          focusPoint[0][0] = null
          focusPoint[0][1] = null
        } else {
          if (minutesData.price) {
            focusPoint[0][0] = index
            focusPoint[0][1] = minutesData.price
          }
        }
      }
      return {priceArr, averagePriceArr, percentArr, focusPoint, volumeArr}
    },
    initOptions () {
      if (!this.defaultOption) return
      const stock = this.stock
      if (!stock.minutesList || stock.minutesList.length < 1) return
      const {
        priceArr,
        averagePriceArr,
        percentArr,
        focusPoint,
        volumeArr
      } = this.getSeriesData(stock)
      this.options = {
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: tooltipFormatter
        },
        axisPointer: {
          show: false,
          triggerTooltip: false,
          lineStyle: {
            // type: 'solid'
          },
          // x轴或者y轴联动
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
            // show: true,
            containLabel: true,
            top: '2%',
            left: 'center',
            bottom: '30%',
            width: '100%',
            height: '72%'
          },
          {
            // show: true,
            containLabel: true,
            left: 'center',
            bottom: 0,
            width: '100%',
            height: '22%'
          }
        ],
        xAxis: [
          {
            type: 'category',
            gridIndex: 0,
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
                show: false
              }
            },
            data: this.defaultOption.xData
          },
          {
            type: 'value',
            gridIndex: 0,
            boundaryGap: false,
            position: 'bottom',
            data: this.defaultOption.helpXData,
            min: 1,
            max: this.defaultOption.max,
            interval: 1,
            axisLabel: {
              show: true,
              // inside: true,
              color: '#858585',
              margin: 6,
              height: 20,
              lineHeight: 20,
              formatter: this.defaultOption.xFormatter,
              rich: {
                right: {
                  padding: [0, 0, 0, 31]
                },
                left: {
                  padding: [0, 31, 0, 0]
                }
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(0,0,0,.1)'
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
            data: this.defaultOption.xData,
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
            min: this.stock.minYaxisPrice,
            max: this.stock.maxYaxisPrice,
            interval: (this.stock.maxYaxisPrice - this.stock.minYaxisPrice) / 4,
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
              color: '#858585',
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
                  return series.value.toFixed(2)
                }
              }
            }
          },
          {
            type: 'value',
            gridIndex: 0,
            max: this.stock.maxYaxisPercent,
            min: -this.stock.maxYaxisPercent,
            interval: this.stock.maxYaxisPercent / 2,
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
              color: '#858585',
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
            yAxisIndex: 0,
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
<style scoped lang="less">
.minutes-wrap{
  position: relative;
  width: 100%;
  height: 100%;
  .test{
    animation: loading-rotate 2s linear forwards infinite;
  }
  .select-wrap{
    position: absolute;
    bottom: calc(20% + 4px);
    width: 56px;
    height: 18px;
    text-align: center;
    padding: 1px 2px;
    box-sizing: border-box;
    line-height: 18px;
    color: #ccc;
    font-size: 12px;
    background-color: #39425b;
    cursor: pointer;
    border-radius: 2px;
    z-index: 999;

    ul{
      position: absolute;
      left: 0;
      width: 100%;
      display: none;
      background-color: #1b212c;

      li{
        padding: 6px 2px;
        text-align: center;
      }
    }
    &:hover ul{
      display: block;
    }
  }
}

@keyframes loading-rotate {
  from{

  }to{
  transform: rotate(360deg);
     }

}
</style>
