<template>
  <v-card>
    <g-row>
      <g-col :sm="24" :md="24" :lg="10">
        <minutes-line-bar :current-stock="currentStock"></minutes-line-bar>
      </g-col>
      <g-col :sm="24" :md="8" :lg="5">
        <OverView></OverView>
      </g-col>
      <g-col :sm="24" :md="16" :lg="9">
        <count-view/>
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

export default {
  name: 'MainTest',
  components: {
    MinutesLineBar,
    MainStocksIndex,
    OverView,
    CountView,
    FundingDetail
  },
  data () {
    return {
      currentStock: {
        market: 'sh',
        id: '000001'
      }
    }
  },
  created () {
    console.log(this.currentStock)
  },
  mounted () {
    this.$bus.$on('currentIndexChange', index => {
      this.currentStock = index
    })
  },
  beforeDestroy () {
    this.$bus.$off('currentIndexChange')
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
  height: 320px;
}
</style>
