<template>
  <el-carousel indicator-position="none" style="background-color: transparent" :autoplay="false">
    <el-carousel-item v-for="(arr,index) in singleList" :key="index">
      <div class="main-stocks-wrap">
        <div
          v-for="(item,sort) in arr"
          :class="{'stock-single-info':true,
           'green-class':item.upDownValue<0,'red-class':item.upDownValue>0,
           'border-top-left-radius':sort===0,'border-top-right-radius':sort===1,'border-bottom-left-radius':sort===4 ,'border-bottom-right-radius':sort===5}"
          :key="item.code"
          @click="checkIndex(item)">
          <div class="title-wrap ">{{ item.name }}</div>
          <div class="index-wrap font-weight-800"><i class="el-icon-caret-bottom"></i>{{ item.currentPrice }}</div>
          <div class="updown-wrap ">{{ item.upDownValue }}&nbsp;{{ item.upDownPercent }}%</div>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
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
      indexList: [
        {name: '上证指数', code: '000001'},
        {name: '创业板指', code: '399006'},
        {name: '深证成指', code: '399001'},
        {name: '沪深300', code: '000300'},
        {name: '上证50', code: '000016'},
        {name: '中小100', code: '399005'}
      ],
      singleList: [],
      currentStock: {
        market: 'sh',
        id: '000001'
      }
    }
  },
  created () {
    this.getSingleInfo()
  },
  methods: {
    checkIndex (index) {
      let market = 'sh'
      if (index.market === '1') {
        market = 'sh'
      }
      if (index.market === '51') {
        market = 'sz'
      }
      if (index.market === '100') {
        market = 'HK'
      }
      this.currentStock = {
        market: market,
        id: index.code
      }
      this.$bus.$emit('currentIndexChange', this.currentStock)
    },
    getSingleInfo () {
      const filter = this.indexList.map(item => {
        return item.code
      })
      const codes = filter.join(',')
      const singleList = []
      this.$axiosGet(`/index/query/single/${codes}`).then(res => {
        let arr = []
        const data = res.data
        for (let i = 0; i < data.length; i++) {
          const single = data[i]
          const count = i + 1
          arr.push(single)
          if (count % 6 === 0) {
            singleList.push(arr)
            arr = []
          }
        }
      })
      this.singleList = singleList
    }
  }
}
</script>

<style scoped lang="less">
.main-stocks-wrap {
  height: 100%;
  &::before,&::after{
    content: '';
    display: block;
    clear: both;
  }
  margin: 8px 4px;
}
.main-stocks-wrap .stock-single-info {
  float: left;
  width: calc(50% - 4px);
  cursor: pointer;
  color: #ffffff;
  margin-bottom: 8px;
}
.stock-single-info:nth-child(2n+1){
  margin-right: 4px;
}
.stock-single-info:nth-child(2n){
  margin-left: 4px;
}
.green-class {
  background: linear-gradient(to bottom, #1d9a63, 100%, #161a23);
}
.red-class {
  background: linear-gradient(to bottom, #ef4257, 100%, #161a23);
}
.stock-single-info .title-wrap {
  height: 30px;
  line-height: 30px;
  font-size: 13px;
}
.stock-single-info .index-wrap {
  height: 36px;
  line-height: 36px;
}
.stock-single-info .updown-wrap {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}
/deep/ .el-carousel__container {
  height: 320px !important;
}
</style>
