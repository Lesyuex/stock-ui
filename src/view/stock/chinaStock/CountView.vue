<template>
  <div class="count-wrap">
    <bar-line-chart :custom-option="customOption"/>
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
      customOption: {
        xAxisData: [],
        seriesData: [],
        chartTitle: '市场总览',
        seriesNameArr: ['涨跌家数'],
        doubleYLine: false,
        labelColor: ['#ccc'],
        xAxisLabelColor: '#fff',
        gridLeft: 'center',
        barCategoryGap: 15,
        openTooltip: true
      }
    }
  },
  mounted () {
    this.getCount()
  },
  methods: {
    getCount () {
      this.$axiosGet('/count/get/detail').then(res => {
        const data = res.data
        this.customOption.seriesData = [
          [
            {value: data.percentMax, itemStyle: {color: '#ee4957'}},
            {value: data.gtSeven, itemStyle: {color: '#ee4957'}},
            {value: data.gtFive, itemStyle: {color: '#ee4957'}},
            {value: data.gtTwo, itemStyle: {color: '#ee4957'}},
            {value: data.gtZero, itemStyle: {color: '#ee4957'}},
            {value: data.eqZero, itemStyle: {color: 'gray'}},
            {value: data.ltZero, itemStyle: {color: '#01d078'}},
            {value: data.ltNegaTwo, itemStyle: {color: '#01d078'}},
            {value: data.ltNegaFive, itemStyle: {color: '#01d078'}},
            {value: data.ltNegaSeven, itemStyle: {color: '#01d078'}},
            {value: data.percentMin, itemStyle: {color: '#01d078'}}
          ]
        ]
        this.customOption.xAxisData = ['涨停', '>7%', '7~5%', '5~2%', '2~0%', '平', '0~-2%', '-2~-5%', '-5~-7%', '<-7%', '跌停']
      })
    }
  }
}
</script>
<style scoped>
.count-wrap{
  background-color: #161a23;
  height: calc(100% - 16px);
  margin: 8px 4px;
  border-radius: 5px;
}
</style>
