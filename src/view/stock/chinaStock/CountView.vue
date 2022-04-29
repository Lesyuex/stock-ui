<template>
  <div class="count-wrap">
    <bar-line-chart :custom-option="customOption" style="height: calc(100% - 26px)"/>
    <div class="num-box">
      <div class="bar" style="background-color: #ee4957">
        <div class="text" style="color: #ee4957;text-align: left">涨{{ upDownDetail.up }}家</div>
      </div>
      <div class="bar" style="background-color: gray">
        <div class="text" style="font-size: 12px;color: gray;left: -21px">平{{ upDownDetail.flat }}家</div>
      </div>
      <div class="bar" style="background-color: #01d078">
        <div class="text" style="font-size: 12px;color: #01d078;text-align: right;right: 0">跌{{ upDownDetail.down }}家</div>
      </div>
    </div>
  </div>
</template>
<script>
import BarLineChart from '../components/BarLineChart'
import openTimer from '../../../mixins'

export default {
  mixins: [openTimer],
  components: {
    BarLineChart
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
      customOption: {
        hideY1Line: true,
        hideLegend: true,
        xAxisData: [],
        seriesData: [],
        seriLabelFS: 15,
        chartTitle: '涨跌总览',
        seriesNameArr: ['涨跌家数'],
        doubleYLine: false,
        seriLabelClr: ['#adb4c2'],
        showX1AllLabel: true,
        gridBottom: 8
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
        this.upDownDetail = {
          up: data.allUpNum,
          down: data.allDownNum,
          flat: data.flatNum,
          num: data.allUpNum + data.flatNum + data.allDownNum
        }
        const barArr = document.getElementsByClassName('bar')
        barArr[0].style.width = (this.upDownDetail.up / this.upDownDetail.num * 100) + '%'
        barArr[1].style.width = (this.upDownDetail.flat / this.upDownDetail.num * 100) + '%'
        barArr[2].style.width = (this.upDownDetail.down / this.upDownDetail.num * 100) + '%'
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
  height: calc(100% - 16px);
  margin: 8px 4px;
  border-radius: 5px;

  .num-box {
    height: 30px;
    &::before,&::after{
      content: '';
      display: block;
      clear: both;
    }
    // 前三个盒子
    div:nth-child(-n+3) {
      position: relative;
      float: left;
      height: 10px;
      width: calc(100% / 3);
      div{
        position: absolute;
        top: 10px;
        height: 16px;
        font-size: 12px;
        line-height: 16px;
        min-width: 55px;
      }
    }
  }
}
</style>
