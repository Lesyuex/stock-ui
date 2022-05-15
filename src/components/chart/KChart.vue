<template>
  <div class="k-chart" :id="refName" :key="refName">
    <div style="height: 20px;width:98%;background-color: #161922;position: absolute;left:12px;top:2px;z-index: 999" v-if="mouseOnChart">
      <div v-for="(ma,index) in chartData.maName" :key="index" style="display: inline-block;width: 110px;font-size: 13px;">
        <span :style="{color:chartData.maColor[index],display:'inline-block',fontWeight:500 }" >
          {{ma}}
          <span style="color: #cccccc;display:inline-block">: {{getCurrentMa[ma]}}</span>
        </span>
      </div>
    </div>
    <echarts :options="options" :eventName="'globalout'" @handleEvent="handleEvent"/>
    <el-icon class="el-icon-loading" style="position: absolute;top:30%;left:calc(50% - 15px);font-size: 30px" v-if="loading"/>
  </div>
</template>

<script>
import Echarts from './Echarts'
import moment from 'moment'

export default {
  name: 'DayChart',
  components: {
    Echarts
  },
  props: {
    marketCode: String,
    comInfo: Object,
    refName: String
  },
  data () {
    return {
      loading: true,
      mouseOnChart: false,
      dom: document.getElementById('spinning'),
      options: {},
      chartData: {
        xData: [],
        yData: [],
        volumeData: [],
        turnoverRateArr: [],
        percentArr: [],
        newestPrice: 0,
        selectIndex: 0,
        ma: {},
        maName: ['MA5', 'MA10', 'MA20', 'MA30', 'MA60', 'MA120'],
        maColor: ['#ff4b4b', '#f8d58a', '#068afd', '#ff9100', 'pink', '#64be6d']
      }
    }
  },
  computed: {
    getCurrentMa () {
      const dataIndex = this.chartData.selectIndex
      const MA5 = this.chartData.ma['MA5'][dataIndex]
      const MA10 = this.chartData.ma['MA10'][dataIndex]
      const MA20 = this.chartData.ma['MA20'][dataIndex]
      const MA30 = this.chartData.ma['MA30'][dataIndex]
      const MA60 = this.chartData.ma['MA60'][dataIndex]
      const MA120 = this.chartData.ma['MA120'][dataIndex]
      return {MA5, MA10, MA20, MA30, MA60, MA120}
    },
    tooltipFormatter () {
      const that = this
      return (params) => {
        let html = '<div>' + moment(params[0].axisValue).format('YYYY-MM-DD') + '</div>'
        const dataIndex = params[0].dataIndex
        that.chartData.selectIndex = dataIndex
        that.mouseOnChart = true
        const currentK = this.chartData
        // 涨跌幅 开盘价 收盘价 最高 最低 成交量 换手率
        const open = currentK.yData[dataIndex][0] || '-'
        const close = currentK.yData[dataIndex][1] || '-'
        const lowest = currentK.yData[dataIndex][2] || '-'
        const highest = currentK.yData[dataIndex][3] || '-'
        const volume = currentK.volumeData[dataIndex] || '-'
        const rate = currentK.turnoverRateArr[dataIndex] || '-'
        const percent = currentK.percentArr[dataIndex] || '-'
        // 涨跌幅
        let color
        if (percent > 0) {
          color = '#ee4957'
        } else if (percent < 0) {
          color = '#01d078'
        } else {
          color = 'gray'
        }
        const marker0 = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`
        const percentText = `<div style="text-align: left">${marker0}涨跌幅：${percent}%</div>`
        // 开盘价
        const openText = `<div style="text-align: left">${marker0}开盘价：${open}</div>`
        // 收盘价
        const closeText = `<div style="text-align: left">${marker0}收盘价：${close}</div>`
        // 最高价
        const highestText = `<div style="text-align: left">${marker0}最高价：${highest}</div>`
        // 最低价
        const lowestText = `<div style="text-align: left">${marker0}最低价：${lowest}</div>`
        // 成交量
        const marker5 = '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0091fc;"></span>'
        const volumeText = `<div style="text-align: left">${marker5}成交量：${volume}手</div>`
        // 换手率
        const marker6 = '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#ff9e12;"></span>'
        const rateText = `<div style="text-align: left">${marker6}换手率：${rate}%</div>`
        return html + percentText + openText + closeText + highestText + lowestText + volumeText + rateText
      }
    },
    showLength () {
      const length = this.chartData.xData.length
      if (length <= 160) return 0
      const kname = this.comInfo.kname
      if (kname === 'season' || kname === 'year') {
        return 0
      } else {
        if (length <= 320) {
          if (kname === 'day') return 80
          if (kname === 'week') return 60
          if (kname === 'month') return 40
        }
      }
      return 0
    }
  },
  created () {
    this.refreshData()
  },
  watch: {
    marketCode: function () {
      this.refreshData()
    }
  },
  methods: {
    handleEvent () {
      this.mouseOnChart = false
    },
    refreshData () {
      this.getKdata()
    },
    calculateMA (dayCount) {
      const result = []
      const data = this.chartData
      for (let i = 0; i < data.yData.length; i++) {
        if (i < dayCount) {
          result.push('-')
          continue
        }
        let sum = 0
        for (let j = 0; j < dayCount; j++) {
          sum += data.yData[i - j][1]
        }
        result.push(+(sum / dayCount).toFixed(2))
      }
      return result
    },
    getKdata () {
      // const today = moment().add(1, 'days').format('YYYY-MM-DD')
      const param = {
        code: this.marketCode,
        startDate: '',
        endDate: '',
        kname: this.comInfo.kname,
        ktype: this.comInfo.ktype,
        stockType: this.comInfo.stockType
      }
      this.$axiosPost(`/k/get`, param).then(res => {
        const dataList = res.data
        const xData = []
        // [open, close, lowest, highest] （即：[开盘值, 收盘值, 最低值, 最高值]）
        const yData = []
        const volumeData = []
        const rateArr = []
        const percentArr = []
        for (let i = 0; i < dataList.length; i++) {
          const data = dataList[i]
          xData.push(data.date)
          const y = [data.open, data.close, data.lowest, data.highest]
          yData.push(y)
          volumeData.push(data.volume)
          rateArr.push(data.turnoverRate)
          let percent
          if (i > 0) {
            const yestclose = dataList[i - 1].close
            percent = ((data.close - yestclose) / yestclose) * 100
          } else {
            percent = 0
          }
          percentArr.push(percent.toFixed(2))
          this.chartData.newestPrice = data.close
        }
        this.chartData.xData = xData
        this.chartData.yData = yData
        this.chartData.volumeData = volumeData
        this.chartData.turnoverRateArr = rateArr
        this.chartData.percentArr = percentArr
        this.chartData.selectIndex = this.chartData.xData.length - 1
        const MA5 = this.calculateMA(5)
        const MA10 = this.calculateMA(10)
        const MA20 = this.calculateMA(20)
        const MA30 = this.calculateMA(30)
        const MA60 = this.calculateMA(60)
        const MA120 = this.calculateMA(120)
        this.chartData.ma = {MA5, MA10, MA20, MA30, MA60, MA120}
      }).finally(() => {
        this.initOptions()
      })
    },

    initOptions () {
      const ma = this.getCurrentMa
      const color = this.chartData.maColor
      this.options = {
        color: color,
        title: null,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: this.tooltipFormatter
        },
        legend: {
          left: -8,
          icon: 'none',
          itemWidth: 10,
          textStyle: {
            rich: {
              value: {
                color: 'white'
              }
            }
          },
          data: [
            {name: 'MA5',
              textStyle: {
                rich: {
                  name: {
                    color: color[0]
                  }
                }
              }},
            {name: 'MA10',
              textStyle: {
                rich: {
                  name: {
                    color: color[1]
                  }
                }
              }},
            {name: 'MA20',
              textStyle: {
                rich: {
                  name: {
                    color: color[2]
                  }
                }
              }},
            {name: 'MA30',
              textStyle: {
                rich: {
                  name: {
                    color: color[3]
                  }
                }
              }},
            {name: 'MA60',
              textStyle: {
                rich: {
                  name: {
                    color: color[4]
                  }
                }
              }},
            {name: 'MA120',
              textStyle: {
                rich: {
                  name: {
                    color: color[5]
                  }
                }
              }}
          ],
          formatter: function (name) {
            return '{name|' + name + '}' + '{value| : ' + ma[name] + '}'
          }
        },
        grid: [
          {
            left: '2%',
            top: 32,
            height: '50%',
            width: this.chartData.xData.length < 60 ? this.chartData.xData.length + '%' : '96%',
            backgroundColor: 'transparent',
            containLabel: false
          },
          {
            left: '2%',
            top: '70%',
            height: '15%',
            width: this.chartData.xData.length < 60 ? this.chartData.xData.length + '%' : '96%',
            backgroundColor: 'red',
            containLabel: false
          }
        ],
        axisPointer: {
          link: [
            {
              xAxisIndex: 'all'
            }
          ],
          label: {
            backgroundColor: '#777'
          }
        },
        xAxis: [
          {
            gridIndex: 0,
            scale: false,
            type: 'category',
            data: this.chartData.xData,
            boundaryGap: false,
            axisLine: {onZero: false},
            axisTick: {show: false},
            splitLine: {show: false},
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
              show: true,
              label: {
                formatter: function () {
                  return ''
                },
                backgroundColor: 'transparent'
              }
            }
          },
          {
            gridIndex: 1,
            scale: false,
            type: 'category',
            data: this.chartData.xData,
            boundaryGap: false,
            axisLabel: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
              show: true

            }
          }
        ],
        yAxis: [
          {
            gridIndex: 0,
            min: function (value) {
              return Math.ceil(value.min)
            },
            max: function (value) {
              return Math.ceil(value.max)
            },
            splitNumber: 3,
            axisLabel: {
              inside: true,
              margin: -10,
              formatter: function (value, index) {
                return value.toFixed(2)
              }
            },
            scale: true,
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          {
            gridIndex: 1,
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: this.showLength,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            xAxisIndex: [0, 1],
            top: '90%',
            left: '1%',
            width: this.chartData.xData.length < 60 ? this.chartData.xData.length + 1 + '%' : '96%',
            height: 20,
            start: this.showLength,
            end: 100,
            // 整个筛选器的边框
            borderColor: '#5e5e5e',
            // 移动手柄（左右）大小
            handleSize: 20,
            // 移动手柄(上方)大小
            moveHandleSize: 0,
            // 未选中
            dataBackground: {
              lineStyle: {
                color: 'gray',
                // 选中区域线条的透明度
                opacity: 1
              },
              areaStyle: {
                color: '#8f8f8f',
                // 选中区域阴影的透明度
                opacity: 0.1
              }
            },
            // 选中区域的样式
            selectedDataBackground: {
              lineStyle: {
                color: 'gold',
                // 选中区域线条的透明度
                opacity: 1
              },
              areaStyle: {
                color: '#f66c7c',
                // 选中区域阴影的透明度
                opacity: 0.5
              }
            }
          }
        ],
        series: [
          {
            name: 'K线图',
            type: 'candlestick',
            data: this.chartData.yData,
            itemStyle: {
              color: '#ee4957',
              color0: '#01d078'
            },
            /*        itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: upBorderColor,
              borderColor0: downBorderColor
            }, */
            markPoint: {

              data: [
                {
                  name: '可视区域最高点',
                  type: 'max',
                  valueDim: 'highest',
                  symbol: 'arrow',
                  symbolSize: 0,
                  label: {
                    fontSize: 12,
                    position: 'bottom',
                    align: 'left',
                    verticalAlign: 'top',
                    distance: -6,
                    color: '#569cde',
                    formatter: (param) => {
                      return '{hr|} ' + param.value.toFixed(2)
                    },
                    rich: {
                      hr: {
                        width: 25,
                        height: 1,
                        backgroundColor: '#569cde'
                      }
                    }
                  }
                },
                {
                  name: '可视区域最低点',
                  type: 'min',
                  valueDim: 'lowest',
                  symbol: 'arrow',
                  symbolSize: 0,
                  label: {
                    position: 'top',
                    align: 'right',
                    distance: -6,
                    verticalAlign: 'bottom',
                    fontSize: 12,
                    color: '#569cde',
                    formatter: (param) => {
                      return param.value.toFixed(2) + ' {hr|}'
                    },
                    rich: {
                      hr: {
                        width: 25,
                        height: 1,
                        backgroundColor: '#569cde'
                      }
                    }
                  }
                }
              ]
            },
            markLine: {
              symbol: 'none',
              data: [
                {
                  yAxis: this.chartData.newestPrice
                }
              ],
              label: {
                show: false
              },
              lineStyle: {
                width: 1,
                type: 'dashed',
                color: 'skyblue'
              }
            }
          },
          {
            name: 'MA5',
            type: 'line',
            data: this.chartData.ma['MA5'],
            smooth: true,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA10',
            type: 'line',
            data: this.chartData.ma['MA10'],
            smooth: true,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA20',
            type: 'line',
            data: this.chartData.ma['MA20'],
            smooth: true,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA30',
            type: 'line',
            data: this.chartData.ma['MA30'],
            smooth: true,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA60',
            type: 'line',
            data: this.chartData.ma['MA60'],
            smooth: true,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA120',
            type: 'line',
            data: this.chartData.ma['MA120'],
            smooth: true,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5
            }
          },
          // 成交量
          {
            name: '成交量',
            type: 'bar',
            // 以哪个y轴为参考线
            xAxisIndex: 1,
            yAxisIndex: 1,
            // data:[ [xValue,yValue]]
            data: this.chartData.volumeData.map((volume, index) => {
              const value = volume
              const itemStyle = {
                color: ''
              }
              // 收盘价是否大于开盘价
              itemStyle.color = this.chartData.yData[index][1] > this.chartData.yData[index][0] ? '#ee4957' : '#01d078'
              return {value, itemStyle}
            })
          }
        ]
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.k-chart {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
