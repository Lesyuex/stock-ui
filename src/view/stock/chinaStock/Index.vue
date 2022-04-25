<template>
  <v-card>
    <div class="box-wrap">
      <minutes-line-bar :current-stock="currentStock"></minutes-line-bar>
    </div>
    <div class="box-wrap">
   <OverView></OverView>
         </div>
    <div class="box-wrap">
      <count-view/>
    </div>

  </v-card>
</template>

<script>
import MinutesLineBar from '../components/MinutesLineBar'
import MainStocksIndex from './OtherChartIndex'
import OverView from './OverView'
import CountView from './CountView'

export default {
  name: 'MainTest',
  components: {
    MinutesLineBar,
    MainStocksIndex,
    OverView,
    CountView
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

/*  @media screen and (max-width: 1408px){
    .box-wrap{
      width: 100%;
    }
  }
  @media screen and (min-width: 1408px){
    .box-wrap{
      width: 50%;
    }
  }*/
</style>
