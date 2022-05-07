<template>
  <v-card>
    <g-row>
      <g-col sm="24" md="10" class="marginT8">
        <index-choice-chart :marketCode="marketCode"/>
      </g-col>
      <g-col sm="24" md="14" class="marginT8">
        <g-row>
          <g-col :sm="12" :md="12">
            <count-view/>
          </g-col>
          <g-col sm="12" md="12">
            <over-view></over-view>
          </g-col>
        </g-row>
      </g-col>
      <g-col sm="24" md="14" class="marginT8">
        <g-row>
          <g-col :sm="12" :md="12">
            <plate-single></plate-single>
          </g-col>
          <g-col sm="12" md="12">
            <plate-single></plate-single>
          </g-col>
        </g-row>

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
import BarPieChart from '../stock/components/PieChart'
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
