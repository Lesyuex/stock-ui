<template>
  <v-card>
    <g-row>
      <g-col sm="24" md="10" class="marginT8" style="padding: 0 6px">
        <index-choice-chart :marketCode="marketCode"/>
      </g-col>
      <g-col sm="24" md="8" class="marginT8" style="padding: 0 6px">
        <count-view/>
      </g-col>
      <g-col sm="24" md="6" class="marginT8" style="padding: 0 6px">
       <market/>
      </g-col>
      <g-col sm="24" md="8" class="marginT8" style="padding: 0 6px">
        <funding-detail/>
      </g-col>
      <g-col sm="24" md="6" class="marginT8" style="padding: 0 6px">
        <plate-single></plate-single>
      </g-col>
      <g-col sm="24" md="8" class="marginT8">
        <plate-single></plate-single>
      </g-col>

      <g-col sm="24" md="14" class="marginT8">
        <g-row style="width: calc(100% - 8px);margin: 0 0 0 8px">
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
import IndexChoiceChart from './components/IndexChoiceChart'
import OverView from './OverView'
import FundingDetail from '../fundingDetail/FundingDetail'
import CountView from './CountView'
import PlateSingle from '../components/PlateSingle'
import BarPieChart from '../../components/chart/PieChart'
import Market from './Market'

export default {
  name: 'Home',
  components: {
    IndexChoiceChart,
    OverView,
    FundingDetail,
    CountView,
    BarPieChart,
    PlateSingle,
    Market
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
/*.marginT8 {
  margin-left: 8px;

  &:nth-child(n+1) {
    margin-right: 8px;
  }
}*/

</style>
