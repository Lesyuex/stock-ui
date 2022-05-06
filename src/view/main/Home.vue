<template>
  <v-card>
    <g-row>
      <g-col sm="24" md="10" class="main-wrap">
        <index-choice-chart :marketCode="marketCode"/>
      </g-col>

      <g-col :sm="12" :md="7">
        <count-view/>
      </g-col>
      <g-col sm="12" md="7">
        <over-view></over-view>
      </g-col>
      <g-col sm="24" md="14">
        <plate-single></plate-single>
      </g-col>
    </g-row>
  </v-card>
</template>

<script>
import IndexChoiceChart from '../stock/components/IndexChoiceChart'
import OverView from '../stock/chinaStock/OverView'
import FundingDetail from '../stock/chinaStock/FundingDetail'
import CountView from '../stock/chinaStock/CountView'
import PlateSingle from '../stock/PlateSingle'
import BarPieChart from '../stock/components/BarPieChart'
export default {
  name: 'Home',
  components: {
    IndexChoiceChart,
    OverView,
    FundingDetail,
    CountView,
    BarPieChart,
    PlateSingle
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

<style scoped lang="less">
.main-wrap{
  height: 840px;
}

</style>
