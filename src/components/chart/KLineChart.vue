<template>
  <div class="k-chart">
    <echarts :options="options"/>
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
    marketCode: String
  },
  data () {
    return {
      options: {},
      chartData: {
        xData: [],
        yData: [],
        volumeData: []
      }
    }
  },
  created () {
    this.refreshData()
  },
  methods: {
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
      const today = moment().format('YYYY-MM-DD')
      const param = {
        'code': '603138',
        'endDate': today,
        'ktype': 'day',
        'startDate': '2022-04-20',
        'type': 0
      }
      this.$axiosPost('/k/query', param).then(res => {
        console.log(res)
        const xData = []
        const yData = []
        const volumeData = []
        res.data.forEach(data => {
          xData.push(data.date)
          const y = [data.open, data.close, data.lowest, data.highest]
          yData.push(y)
          volumeData.push(data.volume)
        })
        this.chartData.xData = xData
        this.chartData.yData = yData
        this.chartData.volumeData = volumeData
      }).finally(() => this.initOptions())
    },

    initOptions () {
      this.options = {
        title: null,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        /*      legend: {
          data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
        }, */
        grid: [
          {
            left: 'center',
            top: 20,
            height: '50%',
            width: '96%',
            backgroundColor: 'transparent',
            containLabel: false
          },
          {
            left: 'center',
            top: '70%',
            height: '15%',
            width: '96%',
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
            splitLine: {show: false},
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
              z: 100
            }
          },
          {
            gridIndex: 1,
            scale: false,
            type: 'category',
            data: this.chartData.xData,
            boundaryGap: false,
            axisLabel: {show: false},
            splitLine: {show: false},
            min: 'dataMin',
            max: 'dataMax'
          }
        ],
        yAxis: [
          {
            gridIndex: 0,
            axisLabel: {
              inside: true,
              margin: -10,
              formatter: function (value) {
                return value.toFixed(2)
              }
            },
            scale: true,
            splitArea: {
              show: false
            },
            splitLine: {
              show: false,
              splitNumber: 5
            }
          },
          {
            gridIndex: 1,
            axisLabel: {
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
            start: 90,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            xAxisIndex: [0, 1],
            top: '90%',
            width: '96%',
            height: 20,
            start: 90,
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
            name: '日K',
            barWidth: 8,
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
              label: {
                formatter: function (param) {
                  return param != null ? Math.round(param.value) + '' : ''
                }
              },
              data: [
                {
                  name: '可视区域最高点',
                  type: 'max',
                  valueDim: 'highest',
                  symbol: 'circle',
                  symbolSize: 0,
                  label: {
                    position: 'right',
                    fontSize: 12,
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
                  symbol: 'circle',
                  symbolSize: 0,
                  label: {
                    position: 'left',
                    fontSize: 12,
                    color: '#569cde',
                    formatter: (param) => {
                      return param.value.toFixed(2) + ' {hr|} '
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
            }
          },
          {
            name: 'MA5',
            type: 'line',
            data: this.calculateMA(5),
            smooth: true,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA10',
            type: 'line',
            data: this.calculateMA(10),
            smooth: true,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA20',
            type: 'line',
            data: this.calculateMA(20),
            smooth: true,
            symbol: 'none',
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA30',
            type: 'line',
            data: this.calculateMA(30),
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
            barWidth: 8,
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
    }
  }
}
</script>

<style scoped>
.k-chart {
  height: 100%;
  width: 100%;
}
</style>
