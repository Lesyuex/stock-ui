<template>
  <c-card>
    <c-row>
      <c-col :span="12" :sm="24" md="12" :lg="8" style="padding: 0 4px;margin-top: 8px;">
        <index-choice-chart :marketCode="marketCode"/>
        <contain-stock/>
      </c-col>
      <c-col :span="12" :sm="24" md="12" :lg="8" style="padding: 0 4px;margin-top: 8px;">
        <count-view/>
      </c-col>
      <c-col :span="12" :sm="24" md="12" :lg="8"  style="padding: 0 4px;margin-top: 8px;">
        <over-view></over-view>
<!--        <market/>-->
      </c-col>
      <c-col :span="12" :sm="24" md="12" :lg="8" style="padding: 0 4px;margin-top: 8px;">
        <plate-single></plate-single>
      </c-col>
      <c-col :span="12" :sm="24" md="12" :lg="8" style="padding: 0 4px;margin-top: 6px;">
        <funding-detail/>
      </c-col>
    </c-row>
  </c-card>
</template>

<script>
import IndexChoiceChart from './components/IndexChoiceChart'
import OverView from './OverView'
import FundingDetail from '../fundingDetail/FundingDetail'
import CountView from './CountView'
import PlateSingle from '../components/PlateSingle'
import BarPieChart from '../../components/chart/PieChart'
import Market from './Market'
import ContainStock from './ContainStock'

export default {
  name: 'Home',
  components: {
    ContainStock,
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
