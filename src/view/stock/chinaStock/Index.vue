<template>
  <v-card>
    <g-row>
      <g-col sm="24" md="16" lg="12">
        <choice-chart :market-code="marketCode"/>
      </g-col>
      <g-col :sm="24" :md="16" :lg="12">
        <count-view/>
      </g-col>
      <g-col :sm="24" :md="8" :lg="8">
        <OverView></OverView>
      </g-col>

      <g-col :sm="24" :md="24" :lg="10">
        <funding-detail/>
      </g-col>
    </g-row>
  </v-card>
</template>

<script>
import MinutesLineBar from '../components/MinutesLineBar'
import MainStocksIndex from './OtherChartIndex'
import OverView from './OverView'
import CountView from './CountView'
import FundingDetail from './FundingDetail'
import ChoiceChart from '../components/StockChoiceChart'
export default {
  name: 'MainTest',
  components: {
    MinutesLineBar,
    MainStocksIndex,
    OverView,
    CountView,
    FundingDetail,
    ChoiceChart
  },
  data () {
    return {
      marketCode: 'sh000001'
    }
  },
  mounted () {
    this.$bus.$on('checkStock', marketCode => {
      this.marketCode = marketCode
    })
  },
  beforeDestroy () {
    this.$bus.$off('checkStock')
  }
}
</script>

<style scoped>
.box-wrap {
  float: left;
  /*    background-color: indianred;*/
  width: 540px;
}

.g-col {
  height: 420px;
}
</style>
