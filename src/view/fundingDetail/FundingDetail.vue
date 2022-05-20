<template>
  <div class="funding-wrap">
    <div style="line-height: 40px;font-size: 18px;font-weight: 400;">资金</div>
    <bar-line-chart :custom-option="s2n" style="height: 350px"/>
  </div>
</template>
<script>
import BarLineChart from '../../components/chart/BarLineChart'
import openTimer from '../../mixins'
import moment from 'moment'

export default {
  mixins: [openTimer],
  name: 'FondingDetail',
  components: {
    BarLineChart
  },
  data () {
    return {
      n2sTurnover: '-',
      activeName: '北向资金',
      s2n: {
        gridWidth: '96%',
        gridLeft: 10,
        hideX1: true,
        hideSeriLabel: true,
        hideY1Line: true,
        xAxisData: [],
        seriesData: [],
        seriesNameArr: ['沪股通', '深股通', '北向资金'],
        seriesType: ['line', 'line', 'line'],
        labelShow: false,
        doubleYLine: false,
        labelColor: ['#ccc'],
        yLabelFormatter: '{value} 亿',
        showHelpX: true,
        formatter: this.getFormatter()
      },
      n2s: {
        xAxisData: [],
        seriesData: [],
        seriesType: ['line', 'line', 'line'],
        labelShow: false,
        seriesNameArr: ['沪股通', '深股通', '南向资金'],
        yAxisVisible: true,
        yAxisLabelVisible: true,
        doubleYLine: false,
        labelColor: ['#ccc'],
        xAxisLabelColor: '#fff',
        barCategoryGap: 15,
        openTooltip: true
      }
    }
  },
  mounted () {
    this.getCount()
  },
  methods: {
    handleClick (tab, event) {
      const that = this
      if (tab.name === '南向资金') {
        that.$nextTick(function () {
          that.$refs.n2s.$refs.chart.resize()
        })
      }
    },
    getFormatter () {
      const s = moment().format('YYYY-MM-DD ')
      return (params) => {
        console.log(params)
        let html = '<div>' + moment(s + params[0].axisValue).format('YYYY-MM-DD HH:mm') + '</div>'
        const value1 = params[0].value !== 'NaN' ? (params[0].value * 1).toFixed(2) : '-'
        const value2 = params[1].value !== 'NaN' ? (params[1].value * 1).toFixed(2) : '-'
        const value3 = params[2].value !== 'NaN' ? (params[2].value * 1).toFixed(2) : '-'
        const text1 = '<div style="text-align: left">' + params[0].marker + params[0].seriesName.replaceAll('-', value1) + '</div>'
        const text2 = '<div style="text-align: left">' + params[1].marker + params[1].seriesName.replaceAll('-', value2) + '</div>'
        const text3 = '<div style="text-align: left">' + params[2].marker + params[2].seriesName.replaceAll('-', value3) + '</div>'
        return html + text1 + text2 + text3
      }
    },
    getCount () {
      const that = this
      this.$axiosGet('/funding/get/minutes/detail').then(res => {
        const s2n = res.data.s2n
        const n2s = res.data.s2n
        const s2nXdata = []
        const s2nshDiff = []
        const s2nszDiff = []
        const s2nFoudingDiff = []
        s2n.forEach(item => {
          s2nXdata.push(item.time)
          const shParam = {
            value: item.shDiff === '-' ? null : (item.shDiff / 10000).toFixed(2)
          }
          s2nshDiff.push(shParam)
          const szParam = {
            value: item.szDiff === '-' ? null : (item.szDiff / 10000).toFixed(2)
          }
          s2nszDiff.push(szParam)
          const foudingDiff = {
            value: item.foudingDiff === '-' ? null : (item.foudingDiff / 10000).toFixed(2)
          }
          s2nFoudingDiff.push(foudingDiff)
          if (foudingDiff.value) {
            this.s2n.seriesNameArr = [`北向资金净流入:${foudingDiff.value || '-'}亿`, `沪股通净流入:${shParam.value || '-'}亿`, `深股通净流入:${szParam.value || '-'}亿`]
          }
        })
        const n2sXdata = []
        const n2sshDiff = []
        const n2sszDiff = []
        const n2sFoudingDiff = []
        n2s.forEach(item => {
          n2sXdata.push(item.time)
          const shParam = {
            value: (item.shDiff / 10000).toFixed(2)
          }
          n2sshDiff.push(shParam)
          const szParam = {
            value: (item.szDiff / 10000).toFixed(2)
          }
          n2sszDiff.push(szParam)
          const foudingDiff = {
            value: (item.foudingDiff / 10000).toFixed(2)
          }
          n2sFoudingDiff.push(foudingDiff)
        })
        this.s2n.xAxisData = s2nXdata
        this.s2n.seriesData = [s2nFoudingDiff, s2nshDiff, s2nszDiff]
        this.s2n.xAxisData = n2sXdata
        this.s2n.seriesData = [n2sshDiff, n2sszDiff, n2sFoudingDiff]
      }).finally(() => {
        if (this.timer) {
          setTimeout(function () {
            that.getCount()
          }, 3333)
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.funding-wrap {
  background-color: #1e2d44;
  height: calc((100vh - 68px) / 2);

  .el-tabs {
    height: 100%;

    /deep/ .el-tabs__content {
      height: calc(100% - 45px);

      .el-tab-pane {
        height: 100%;
      }
    }
  }
}

</style>
