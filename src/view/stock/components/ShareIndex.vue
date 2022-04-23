<template>
  <div class="card-wrap">
    <div class="index-wrap box">
      <h3 style="margin: 6px 12px">上证指数
        <strong>{{stockDetailData.currentPrice}}</strong>
        <span>{{stockDetailData.upDownValue}}</span>
        <span>{{`${stockDetailData.upDownPercent}%`}}</span>
        <a href="#" @click="test">+自选</a>
      </h3>
      <div  style="margin:0 12px">
        <div class="derail-info">最高：3214.54<br>最低：3140.90</div>
        <div class="derail-info">今开：3165.12<br>昨收：3167.13</div>
        <div class="derail-info">成交量：4.18亿手<br>成交额：4224.56亿</div>
        <div class="derail-info">总市值：46.17万亿<br>振<span style="display: inline-block;padding-left: 1em"></span>幅：2.33%</div>
      </div>
      <div id="index-wrap-chart">   </div>
    </div>
    <div class="choice-wrap box">
      <div class="first-row share-info">
        <div class="content-wrap">
          <h5 class="share-title">上证指数</h5>
          <span class="share-index">21374.37</span>
          <span class="share-up-down">-500.00 -3.90%</span>
        </div>
        <div class="share-chart"></div></div>
      <div class="first-row share-info">
        <div class="content-wrap">
          <h5 class="share-title">上证指数</h5>
          <span class="share-index">3330</span>
          <span class="share-up-down">-0.9%(-42.00)</span>
        </div>
        <div class="share-chart"></div></div>
      <div class="first-row share-info">
        <div class="content-wrap">
          <h5 class="share-title">上证指数</h5>
          <span class="share-index">3330</span>
          <span class="share-up-down">-0.9%(-42.00)</span>
        </div>
        <div class="share-chart"></div></div>

      <div class="second-row share-info">
        <div class="content-wrap">
          <h5 class="share-title">上证指数</h5>
          <span class="share-index">3330</span>
          <span class="share-up-down">-42.00 -0.9%</span>
        </div>
        <div class="share-chart"></div></div>
      <div class="second-row share-info">
        <div class="content-wrap">
          <h5 class="share-title">上证指数</h5>
          <span class="share-index">3330</span>
          <span class="share-up-down">-0.9%(-42.00)</span>
        </div>
        <div class="share-chart"></div></div>
      <div class="second-row share-info">
        <div class="content-wrap">
          <h5 class="share-title">上证指数</h5>
          <span class="share-index">3330</span>
          <span class="share-up-down">-0.9%(-42.00)</span>
        </div>
        <div class="share-chart"></div></div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import {am0930To1130, pm1300To1530} from '../js/xAxisData'

export default {
  name: 'shareIndex',
  data () {
    return {
      currentStockData: {},
      shIndexChart: null,
      stockDetailData: {},
      shIndexSeriesData: [
      ],
      requestNum: 0,
      curremtDateTime: moment('2088-08-08 09:30:00').toDate().getTime(),
      timer: null
    }
  },
  created () {
    this.getDetailsData()
  },
  beforeDestroy () {
    window.clearInterval(this.timer)
  },
  mounted () {
    const that = this

    window.addEventListener('resize', () => {
    /*  const elementsByName = document.getElementsByClassName('card-wrap')
      const offsetWidth = elementsByName[0].offsetWidth
      const box = document.getElementsByClassName('box')
      console.log(box[0].offsetWidth)
      if (box[0].offsetWidth * 2 > elementsByName[0].offsetWidth) {
        Array.prototype.forEach.call(box, function (el) {
          console.log(el)
          el.style.width = offsetWidth - 24 + 'px'
        })
      } */
      that.shIndexChart.resize()
    })

    this.$axiosGet('/getminutes?market=hs&id=0000001').then(res => {
      that.shIndexSeriesData = []
      const minutesData = res.data.data
      that.currentStockData = res.data
      const arr = []
      const arr2 = []
      minutesData.forEach(item => {
        arr.push(item[2])
        arr2.push(item[4])
      })
      that.shIndexSeriesData = [arr, arr2]
      this.timer = setInterval(function () {
        that.curremtDateTime = moment(that.curremtDateTime).add(1, 'minutes').toDate().getTime()
        that.test()
      }, 10 * 1000)
    })
  },
  methods: {
    getDetailsData () {
      const that = this
      this.$axiosGet('/getShareDetailInfo?id=sh000001').then(res => {
        that.stockDetailData = res.data
      })
    },
    test () {
      this.requestNum++
      this.drawChart()
    },
    getSeriesData () {
      const allMinutesData = this.currentStockData.data
      const amSeriesPriceArr = []
      const amSeriesUpDownPercentArr = []
      const pmSeriesPriceArr = []
      const pmSeriesUpDownPercentArr = []
      for (let index = 0; index < 121; index++) {
        const am = am0930To1130[index]
        const amTime = moment(am).toDate().getTime()
        // 当前价
        const currentPrice = allMinutesData[index] ? allMinutesData[index][2] : null
        // 涨跌幅
        const currentUpDownPercent = allMinutesData[index] ? allMinutesData[index][4] : null
        amSeriesPriceArr.push([amTime, currentPrice])
        amSeriesUpDownPercentArr.push([amTime, currentUpDownPercent])
        const pm = pm1300To1530[index]
        const pmTime = moment(pm).toDate().getTime()
        // 数据从121下标开始取
        const pmIndex = index + 121
        // 当前价
        const currentPmPrice = allMinutesData[pmIndex] ? allMinutesData[pmIndex][2] : null
        // 涨跌幅
        const currentPmUpDownPercent = allMinutesData[pmIndex] ? allMinutesData[pmIndex][4] : null
        pmSeriesPriceArr.push([pmTime, currentPmPrice])
        pmSeriesUpDownPercentArr.push([pmTime, currentPmUpDownPercent])
      }
      // 存放11：30 和13：00价格
      const am1130Price = amSeriesPriceArr[120] ? amSeriesPriceArr[120][1] : null
      const pm1300Price = pmSeriesPriceArr[0] ? pmSeriesPriceArr[0][1] : null
      const connPriceArr = [am1130Price, pm1300Price]
      // 存放11：30 和13：00涨幅
      const am1130Percent = amSeriesUpDownPercentArr[120] ? amSeriesUpDownPercentArr[120][1] : null
      const pm1300Percent = pmSeriesUpDownPercentArr[0] ? pmSeriesUpDownPercentArr[0][1] : null
      const connPercentArr = [am1130Percent, pm1300Percent]
      const time = moment('2088-08-08 11:30').toDate().getTime()
      const time2 = moment('2088-08-08 13:00').toDate().getTime()
      const connArr = [[time, am1130Price], [time2, pm1300Price]]
      const connArr2 = [[time, am1130Percent], [time2, pm1300Percent]]
      return {
        amPrice: amSeriesPriceArr,
        amPercent: amSeriesUpDownPercentArr,
        pmPrice: pmSeriesPriceArr,
        pmPercent: pmSeriesUpDownPercentArr,
        connPriceArr,
        connPercentArr,
        connArr,
        connArr2
      }
    },
    drawChart (newDta) {
      const that = this
      this.shIndexChart = this.$echarts.init(document.getElementById('index-wrap-chart'))
      // 开盘到当前时间的所有涨跌幅数据
      const percentArr = that.shIndexSeriesData[1]
      const max = Math.max(...percentArr)
      const min = Math.max(...percentArr)
      const yMaxValue = Math.abs(max) > Math.abs(min) ? Math.abs(max) : Math.abs(min)
      const currentDay = '2088-08-08'
      const {amPrice, amPercent, pmPrice, pmPercent, connArr, connArr2} = this.getSeriesData()
      // 记录小光圈位置
      const newestIndex = this.currentStockData.data.length - 1
      const current = currentDay + ' ' + this.currentStockData.data[newestIndex][0]
      let time
      if (current === '2088-08-08 11:30' || (current === '2088-08-08 14:59' && moment().isSameOrAfter(moment().hour(15).minute(0).second(0)))) {
        time = null
      } else {
        time = moment(currentDay + ' ' + time).toDate().getTime()
      }
      const xValue = time
      const yValue = this.currentStockData.data[newestIndex][4]
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        axisPointer: {
          show: true,
          link: [
            {
              // 表示所有 xAxisIndex 为 0、3、4 和 yAxisName 为 'someName' 的坐标轴联动。
              xAxisIndex: [0, 2],
              yAxisIndex: [0, 1, 2, 3, 4, 5]
            }
          ]
        },
        grid: [
          {
            show: false,
            left: ' 10%',
            width: '40%',
            z: 2,
            backgroundColor: '#ccc'
          },
          {
            show: false,
            left: ' 50%',
            width: '1%',
            z: 1,
            backgroundColor: 'red'
          },
          {
            show: false,
            left: '51%',
            width: '40%',
            z: 2,
            backgroundColor: 'green'
          }
        ],
        xAxis: [
          // 第一个图的X轴
          {
            // 画在第一个图
            gridIndex: 0,
            type: 'time',
            boundaryGap: true,
            min: moment(currentDay + ' 09:30').toDate().getTime(),
            max: moment(currentDay + ' 11:30').toDate().getTime(),
            splitNumber: 3,
            axisLine: {
              // X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度上，只有在另一个轴为数值轴且包含 0 刻度时有效。
              onZero: false,
              onZeroAxisIndex: 0,
              lineStyle: {
                color: '#666'
              }
            },
            axisLabel: {
              formatter: function (val, index) {
                const s = moment(val).format('HH:mm')
                if (s === '09:30') return '09:30'
                if (s === '10:30') return '10:30'
                if (s === '11:30') return '11:30/13:00'
                return ''
              }
            },
            // 关闭坐标轴刻度。
            axisTick: {
              show: false
            },
            // 关闭鼠标悬停显示信息
            axisPointer: {
              show: true,
              z: 100,
              label: {
                formatter: function (params) {
                  return moment(params.value).format('HH:mm')
                }
              },
              // 配置线条风格为虚线风格
              lineStyle: {
                type: 'dashed'
              },
              link: [
                {
                  xAxisIndex: [1, 1]
                }, {
                  yAxisIndex: [1, 0]
                }, {
                  yAxisIndex: [1, 1]
                }
              ]
            }
          },
          // 第一个图与第三个图之间的X轴
          /*           {
            // 画在第一个图
            gridIndex: 1,
            type: 'category',
            // 刻度线两边不留白，否则连不上
            boundaryGap: false,
            /!* position:'top', *!/
            axisLabel: {
              show: false
            },
            axisLine: {
              // X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度上，只有在另一个轴为数值轴且包含 0 刻度时有效。
              onZero: false,
              lineStyle: {
                color: '#666'
              }
            },
            // 关闭坐标轴刻度。
            axisTick: {
              show: false
            },
            // 关闭鼠标悬停显示信息
            axisPointer: {
              show: false,
              z: 100
            },
            data: ['conn1', 'conn1']
          }, */
          // 第三个图的x轴
          {
            type: 'time',
            boundaryGap: true,
            // 画在第二个图
            gridIndex: 1,
            min: moment(currentDay + ' 11:30:00').toDate().getTime(),
            max: moment(currentDay + ' 13:00:00').toDate().getTime(),
            interval: 90 * 60 * 1000,
            axisLine: {
              // X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度上，只有在另一个轴为数值轴且包含 0 刻度时有效。
              onZero: false,
              lineStyle: {
                color: '#666'
              }
            },
            axisLabel: {
              show: true,
              formatter: function (val, index) {
                return ''
              }
            },
            // 关闭坐标轴刻度。
            axisTick: {
              show: false
            },
            // 关闭鼠标悬停显示信息
            axisPointer: {
              show: true,
              z: 100,
              label: {
                formatter: function (params) {
                  return moment(params.value).format('HH:mm')
                }
              }
            }
          },
          // 第三个图的x轴
          {
            type: 'time',
            boundaryGap: true,
            // 画在第二个图
            gridIndex: 2,
            min: moment(currentDay + ' 13:00:00').toDate().getTime(),
            max: moment(currentDay + ' 15:00:01').toDate().getTime(),
            splitNumber: 3,
            axisLine: {
              // X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度上，只有在另一个轴为数值轴且包含 0 刻度时有效。
              onZero: false,
              lineStyle: {
                color: '#666'
              }
            },
            axisLabel: {
              show: true,
              formatter: function (val, index) {
                const s = moment(val).format('HH:mm')
                if (s === '14:00') return '14:00'
                if (s === '15:00') return '15:00'
                return ''
              }
            },
            // 关闭坐标轴刻度。
            axisTick: {
              show: false
            },
            // 关闭鼠标悬停显示信息
            axisPointer: {
              show: true,
              z: 100,
              label: {
                formatter: function (params) {
                  return moment(params.value).format('HH:mm')
                }
              }
            }
          }

        ],
        yAxis: [
          // 第一个图左边的y轴
          {
            type: 'value',
            gridIndex: 0,
            max: (this.stockDetailData.yesterdayPrice * (1 + (yMaxValue / 100))).toFixed(2),
            min: (this.stockDetailData.yesterdayPrice * (1 - (yMaxValue / 100))).toFixed(2),
            // 隐藏分割线
            splitLine: {
              show: false
            }
          },
          // 第一个图右边的y轴
          {
            show: false,
            type: 'value',
            gridIndex: 0,
            position: 'right',
            max: yMaxValue,
            min: -yMaxValue,
            // 隐藏分割线
            splitLine: {
              show: false
            }
          },
          // 中间图的左边y轴
          {
            show: false,
            type: 'value',
            gridIndex: 1,
            max: (this.stockDetailData.yesterdayPrice * (1 + (yMaxValue / 100))).toFixed(2),
            min: (this.stockDetailData.yesterdayPrice * (1 - (yMaxValue / 100))).toFixed(2),
            // 隐藏分割线
            splitLine: {
              show: false
            }
          },
          // 中间图的右边边y轴
          {
            show: false,
            type: 'value',
            gridIndex: 1,
            position: 'right',
            max: yMaxValue,
            min: -yMaxValue,
            // 隐藏分割线
            splitLine: {
              show: false
            }
          },
          // 第三个图的左边y轴
          {
            show: false,
            type: 'value',
            gridIndex: 2,
            max: (this.stockDetailData.yesterdayPrice * (1 + (yMaxValue / 100))).toFixed(2),
            min: (this.stockDetailData.yesterdayPrice * (1 - (yMaxValue / 100))).toFixed(2),
            // 隐藏分割线
            splitLine: {
              show: false
            }
          },
          // 第三个图的右边y轴
          {
            type: 'value',
            gridIndex: 2,
            position: 'right',
            max: yMaxValue,
            min: -yMaxValue,
            // 隐藏分割线
            splitLine: {
              show: false
            }
          }

        ],
        series: [
          // 第一张图左边Y轴数据
          {
            name: '分时价',
            type: 'line',
            // 以哪个y轴为参考线
            xAxisIndex: 0,
            yAxisIndex: 0,
            // 是否显示数值，默认不显示
            label: {
              show: false
            },
            // 关掉y轴小圆圈
            showSymbol: false,
            // 折线参数
            lineStyle: {
              color: '#fe9a01',
              width: 1
            },
            // data:[ [xValue,yValue]]
            data: amPrice
          },
          // 第一张图右边Y轴数据
          {
            name: '涨跌幅',
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 1,
            // 是否显示小点点
            showSymbol: false,
            //
            smooth: true,
            lineStyle: {
              width: 1
            },
            // data:[ [xValue,yValue]]
            data: amPercent,
            label: {
              show: true,
              position: 'top',
              formatter: '{c}'
            }
          },
          // 第一张图光圈 挂在第一张图x轴和第一张图右边y轴交叉点上
          {
            name: '光圈',
            type: 'effectScatter',
            effectType: 'ripple',
            xAxisIndex: 0,
            yAxisIndex: 1,
            symbolSize: 4,
            // data:[ [xValue,yValue]]
            data: [[xValue, yValue]]
          },

          // 中间图连接数据
          {
            name: '分时价2',
            type: 'line',
            // 以哪个y轴为参考线
            xAxisIndex: 1,
            yAxisIndex: 2,
            // 是否显示数值，默认不显示
            label: {
              show: false
            },
            // 关掉y轴小圆圈
            showSymbol: false,
            // 折线参数
            lineStyle: {
              color: '#fe9a01',
              width: 1
            },
            // data:[ [xValue,yValue]]
            data: connArr
          },
          {
            name: '涨跌幅2',
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 3,
            // 是否显示小点点
            showSymbol: false,
            //
            smooth: true,
            lineStyle: {
              width: 1
            },
            // data:[ [xValue,yValue]]
            data: connArr2
          },
          // 第三张图左边Y轴数据
          {
            name: '分时价2',
            type: 'line',
            // 以哪个y轴为参考线
            xAxisIndex: 2,
            yAxisIndex: 4,
            // 是否显示数值，默认不显示
            label: {
              show: false
            },
            // 关掉y轴小圆圈
            showSymbol: false,
            // 折线参数
            lineStyle: {
              color: '#fe9a01',
              width: 1
            },
            // data:[ [xValue,yValue]]
            data: pmPrice
          },
          // 第三张图右边Y轴数据
          {
            name: '涨跌幅',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 5,
            // 是否显示小点点
            showSymbol: false,
            //
            smooth: true,
            lineStyle: {
              width: 1
            },
            // data:[ [xValue,yValue]]
            data: pmPercent
          },
          // 第三张图光圈 挂在第三张图x轴和第三张图右边y轴交叉点上
          {
            name: '光圈',
            type: 'effectScatter',
            effectType: 'ripple',
            xAxisIndex: 2,
            yAxisIndex: 5,
            symbolSize: 4,
            // data:[ [xValue,yValue]]
            data: [[xValue, yValue]]
          }
        ]
      }
      this.shIndexChart.setOption(option, true)
    },
    getLowestHighestValue (arr) {
      const max = Math.max(...arr)
      const min = Math.min(...arr)
      return Math.abs(max) > Math.abs(min) ? Math.abs(max) : Math.abs(min)
    }
  }
}
</script>

<style scoped>
@media screen and (max-width: 1408px){
  .box{
    width: calc(100% - 12px);
  }
}
@media screen and (min-width: 1408px){
  .box{
    width: calc(50% - 12px);
  }
}

.card-wrap{
  padding:6px 12px;
  background-color: transparent;
}
.card-wrap:before,.card-wrap:after{
  content: '';
  display: block;
  clear: both;
}
.index-wrap,.choice-wrap{
  float: left;
  /*一半减去内边距*2+中间空隙/2*/
  margin: 6px;
  min-width: 600px;
  background-color: #161A23FF;
  border-radius: 4px;
}
h3{
  position: relative;
  height: 30px;
  font-size: 20px;
  line-height: 30px;
  text-align: left;
}
h3 strong {
  padding-left: 10px;
}
h3 span {
  font-size: 10px;
  padding-left: 10px;
}
h3 a{
  position: absolute;
  right: 8px;
  font-size: 12px;
  line-height: 30px;
}
.index-wrap .derail-info{
  float:left;
  height: 32px;
  width: 25%;
  font-size: 12px;
  text-align: left;
}
#index-wrap-chart{
  float: left;
  width: 100%;
  height: 220px;
}
.choice-wrap{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 292px;
  background-color: transparent;
}
.choice-wrap .share-info{
  position: relative;
  width: 33%;
  height: 143px;
  background-color: #161A23FF;
  border-radius: 4px;
  cursor: pointer;
}
.choice-wrap .first-row{

}
.choice-wrap .second-row{
  margin-top: 8px;
}
.choice-wrap .share-info>div{
  float: left;
  font-size: 14px;
}
.choice-wrap .share-info .content-wrap{
  position: absolute;
  margin-top: 25px;
  width: 100px;
}
.content-wrap *{
  display: block;
  text-indent: 10px;
  text-align: left;
}
.content-wrap .share-title {
  height: 35px;
  line-height: 35px;
}
.content-wrap .share-index{
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
}
.content-wrap .share-up-down{
  height: 35px;
  font-size: 12px;
  line-height: 35px;
}
.choice-wrap .share-info .share-chart{
  height: 120px;
  background-color: transparent;
}
</style>
