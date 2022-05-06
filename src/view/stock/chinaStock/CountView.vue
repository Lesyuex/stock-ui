<template>
  <div class="count-wrap">
    <div style="width: 250px;height: 100px;position: absolute;right: 0;z-index: 999">
      <bar-pie-chart :pieData="pieData" ref="pie"/>
    </div>
    <bar-line-chart :custom-option="customOption" style="height: 100%"/>
  </div>
</template>
<script>
import BarLineChart from '../components/BarLineChart'
import openTimer from '../../../mixins'
import BarPieChart from '../components/BarPieChart'

export default {
  mixins: [openTimer],
  components: {
    BarLineChart,
    BarPieChart
  },
  name: 'CountView',
  data () {
    return {
      upDownDetail: {
        up: 0,
        down: 0,
        flat: 0,
        num: 0
      },
      pieData: [],
      customOption: {
        hideY1Line: true,
        hideY1Label: true,
        hideLegend: true,
        xAxisData: [],
        seriesData: [],
        seriLabelFS: 12,
        x1LabelFS: 12,
        chartTitle: '市场总览',
        seriesNameArr: ['市场总览'],
        doubleYLine: false,
        seriLabelClr: ['#adb4c2'],
        showX1AllLabel: true,
        gridBottom: 4,
        barWidth: 22
      }
    }
  },
  mounted () {
    this.getCount()
  },
  methods: {
    getCount () {
      const that = this
      this.$axiosGet('/count/get/detail').then(res => {
        const data = res.data
        this.customOption.seriesData = [
          [
            {value: data.percentMax, itemStyle: {color: '#ee4957'}},
            {value: data.gtEight, itemStyle: {color: '#ee4957'}},
            {value: data.gtSix, itemStyle: {color: '#ee4957'}},
            {value: data.gtFour, itemStyle: {color: '#ee4957'}},
            {value: data.gtTwo, itemStyle: {color: '#ee4957'}},
            {value: data.gtZero, itemStyle: {color: '#ee4957'}},
            {value: data.eqZero, itemStyle: {color: 'gray'}},
            {value: data.ltZero, itemStyle: {color: '#01d078'}},
            {value: data.ltNegaTwo, itemStyle: {color: '#01d078'}},
            {value: data.ltNegaFour, itemStyle: {color: '#01d078'}},
            {value: data.ltNegaSix, itemStyle: {color: '#01d078'}},
            {value: data.ltNegaEight, itemStyle: {color: '#01d078'}},
            {value: data.percentMin, itemStyle: {color: '#01d078'}}
          ]
        ]
        this.customOption.xAxisData = ['涨停', '>8%', '8~6%', '6~4%', '4~2%', '2~0%', '平', '0~-2%', '-2~-4%', '-4~-6%', '-6~-8%', '<-8%', '跌停']
        this.pieData = [
          {value: data.allUpNum * 1, name: '涨'},
          {value: data.flatNum * 1, name: '平'},
          {value: data.allDownNum * 1, name: '跌'}
        ]

        this.$refs.pie.initOptions()
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
.count-wrap {
  position: relative;
  background-color: #161a23;
  height: 420px;
  margin-top: 8px;
  border-radius: 5px;
}
</style>
