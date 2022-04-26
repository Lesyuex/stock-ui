<template>
  <div class="funding-wrap">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="北向资金" name="北向资金">
        <bar-line-chart :custom-option="s2n"/>
      </el-tab-pane>
      <el-tab-pane label="南向资金" name="南向资金">
        <bar-line-chart :custom-option="n2s" ref="n2s"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BarLineChart from '../components/BarLineChart'
export default {
  components: {
    BarLineChart
  },
  data () {
    return {
      activeName: '北向资金',
      s2n: {
        hideX1: true,
        hideSeriLabel: true,
        xAxisData: [],
        seriesData: [],
        seriesNameArr: ['沪股通', '深股通', '北向资金'],
        seriesType: ['line', 'line', 'line'],
        labelShow: false,
        doubleYLine: false,
        labelColor: ['#ccc'],
        yLabelFormatter: '{value} 亿',
        showHelpX: true,
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
    getCount () {
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
            value: (item.shDiff / 10000).toFixed(2)
          }
          s2nshDiff.push(shParam)
          const szParam = {
            value: (item.szDiff / 10000).toFixed(2)
          }
          s2nszDiff.push(szParam)
          const foudingDiff = {
            value: (item.foudingDiff / 10000).toFixed(2)
          }
          s2nFoudingDiff.push(foudingDiff)
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
        this.s2n.seriesData = [s2nshDiff, s2nszDiff, s2nFoudingDiff]
        this.s2n.xAxisData = n2sXdata
        this.s2n.seriesData = [n2sshDiff, n2sszDiff, n2sFoudingDiff]
      })
    }
  }
}
</script>
<style scoped lang="less">
.funding-wrap {
  background-color: #161a23;
  height: 100%;

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
