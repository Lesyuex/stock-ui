<template>
<div class="market-wrap">
  <h3>指数</h3>
  <ul>
    <li class="row-li" style="display: flex;justify-content: space-between;line-height:40px">
     <span>上证指数</span> <span>3146</span> <span>+1.60%</span> <span>+自选</span>
    </li>
    <li class="row-li" style="display: flex;justify-content: space-between;line-height:40px">
      <span>上证指数</span> <span>3146</span> <span>+1.60%</span> <span>+自选</span>
    </li>
    <li class="row-li" style="display: flex;justify-content: space-between;line-height:40px">
      <span>上证指数</span> <span>3146</span> <span>+1.60%</span> <span>+自选</span>
    </li>
    <li class="row-li" style="display: flex;justify-content: space-between;line-height:40px">
      <span>上证指数</span> <span>3146</span> <span>+1.60%</span> <span>+自选</span>
    </li>
    <li class="row-li" style="display: flex;justify-content: space-between;line-height:40px">
      <span>上证指数</span> <span>3146</span> <span>+1.60%</span> <span>+自选</span>
    </li>
  </ul>
<div></div>
</div>
</template>

<script>
import openTimer from '../../mixins'
import SingleMinutesLineChart from '../../components/chart/SingleMinutesLineChart'
import Chart from '../test/Chart'

export default {
  mixins: [openTimer],
  name: 'Market',
  components: {
    SingleMinutesLineChart,
    Chart
  },
  data () {
    return {
      indexList: [
        {name: '上证指数', marketCode: 'sh000001', currentPrice: '-', upDownValue: '-', upDownPercent: '-'},
        {name: '深证成指', marketCode: 'sz399001', currentPrice: '-', upDownValue: '-', upDownPercent: '-'},
        {name: '创业板指', marketCode: 'sz399006', currentPrice: '-', upDownValue: '-', upDownPercent: '-'},
        {name: '上证50', marketCode: 'sh000016', currentPrice: '-', upDownValue: '-', upDownPercent: '-'},
        {name: '沪深300', marketCode: 'sh000300', currentPrice: '-', upDownValue: '-', upDownPercent: '-'},
        {name: '科创50', marketCode: 'sh000688', currentPrice: '-', upDownValue: '-', upDownPercent: '-'},
        {name: '恒生指数', marketCode: 'hkHSI', currentPrice: '-', upDownValue: '-', upDownPercent: '-'},
        {name: '恒生科技指数', marketCode: 'hkHSTECH', currentPrice: '-', upDownValue: '-', upDownPercent: '-'}
      ],
      singleList: [],
      marketCode: 'sh000001'
    }
  },
  created () {
    this.getSingleInfo()
  },
  methods: {
    refreshData () {
      this.getSingleInfo()
    },
    checkStock (marketCode) {
      this.marketCode = marketCode
      this.$bus.$emit('checkStock', this.marketCode)
    },
    getSingleInfo () {
      const that = this
      const filter = this.indexList.map(item => {
        return item.marketCode
      })
      const codes = filter.join(',')
      const singleList = []
      this.$axiosGet(`/stock/get/single/${codes}`).then(res => {
        let arr = []
        const data = res.data
        for (let i = 0; i < this.indexList.length; i++) {
          const source = this.indexList[i]
          const target = Object.assign(source, data[i])
          const count = i + 1
          arr.push(target)
          if (count % 8 === 0) {
            singleList.push(arr)
            arr = []
          }
        }
      }).finally(() => {
        this.singleList = singleList.length === 0 ? [this.indexList] : singleList
        if (this.timer) {
          window.clearTimeout(that.timer)
          that.timer = setTimeout(function () {
            that.refreshData()
          }, 3000)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.market-wrap{
  position: relative;

  height: calc((100vh - 68px) / 2);
  min-height: 420px;

  border-radius: 5px;
  background-color: #1e2d44;
  ul{
    list-style: none;
    li{
      line-height: 40px;
    }
  }
}
</style>
