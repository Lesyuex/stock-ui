<template>
  <div class="main-stocks-wrap">
    <div class="stock-single-info" v-for="(stock,index) in sixStock" :key="index">
      <div class="content-wrap">
        <h5 class="stock-title">{{stock.name}}</h5>
        <div class="tal fs12 ti1em"><span class=" fs16 fw800">21374.37</span> -500.00 -3.90%</div>
      </div>
    </div>
  </div>
</template>

<script>
import SingleMinutesLineChart from '../components/SingleMinutesLineChart'
import Chart from '../../test/Chart'
export default {
  name: 'MainStocksIndex',
  components: {
    SingleMinutesLineChart,
    Chart
  },
  data () {
    return {
      sixStock: [
        {name: '上证指数', market: 'sh', code: '000001'},
        {name: '创业板指', market: 'sz', code: '399006'},
        {name: '上证50', market: 'sh', code: '000016'},
        {name: '深证成指', market: 'sz', code: '399001'},
        {name: '沪深300', market: 'sh', code: '000300'},
        {name: '科创50', market: 'sh', code: '000688'}
      ],
      currentStock: {
        market: 'sh',
        id: '000001'
      }
    }
  }
}
</script>

<style scoped>
.main-stocks-wrap{
  background-color: #313237;
  border-radius: 4px;
}
.main-stocks-wrap{
  background-color: transparent;
}
.main-stocks-wrap .stock-single-info{
  float: left;
  background-color: #21bf74;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
.main-stocks-wrap .second-row{
  margin-top: 12px;
}
.stock-title{
  text-align: left;
  text-indent: 1em;
  font-size: 12px;
  line-height: 28px;
}
.share-chart{
  height: calc(93px - 1%);
}
</style>
