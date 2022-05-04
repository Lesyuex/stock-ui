<template>
  <el-carousel indicator-position="none" style="background-color: transparent" :autoplay="false">
    <el-carousel-item v-for="(arr,index) in singleList" :key="index">
      <div class="main-stocks-wrap">
        <div
          v-for="(item,sort) in arr"
          :class="{'stock-single-info':true,
           'green-class':item.upDownValue<0,'red-class':item.upDownValue>0,'default-color':item.upDownValue === 0,
           'border-top-left-radius':sort===0,'border-top-right-radius':sort===1,'border-bottom-left-radius':sort===4 ,'border-bottom-right-radius':sort===5}"
          :key="item.code"
          @click="checkStock(item.marketCode)">
          <div class="title-wrap ">{{ item.name }}</div>
          <div class="index-wrap fw800">
            <i class="el-icon-caret-bottom" v-if="item.upDownValue<0"/>
            <i class="el-icon-minus" v-else-if="item.upDownValue===0"/>
            <i class="el-icon-caret-top" v-else/>
            {{ item.currentPrice }}
          </div>
          <div class="updown-wrap ">{{ item.upDownValue }}&nbsp;{{ item.upDownPercent }}%</div>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import SingleMinutesLineChart from '../components/SingleMinutesLineChart'
import Chart from '../../test/Chart'
import openTimer from '../../../mixins'
export default {
  mixins: [openTimer],
  name: 'MainStocksIndex',
  components: {
    SingleMinutesLineChart,
    Chart
  },
  data () {
    return {
      indexList: [
        {name: '上证指数', marketCode: 'sh000001'},
        {name: '创业板指', marketCode: 'sz399006'},
        {name: '深证成指', marketCode: 'sz399001'},
        {name: '沪深300', marketCode: 'sh000300'},
        {name: '上证50', marketCode: 'sh000016'},
        {name: '中小100', marketCode: 'sz399005'}
      ],
      singleList: [

      ],
      marketCode: 'sh000001'
    }
  },
  created () {
    this.getSingleInfo()
  },
  methods: {
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
        for (let i = 0; i < data.length; i++) {
          const marketCode = this.indexList[i].marketCode
          const single = data[i]
          single.marketCode = marketCode
          const count = i + 1
          arr.push(single)
          if (count % 6 === 0) {
            singleList.push(arr)
            arr = []
          }
        }
      }).finally(() => {
        this.singleList = singleList
        if (this.timer) {
          setTimeout(function () {
            that.getSingleInfo()
          }, 3333)
        }
      })
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
  text-align: center;
}
.stock-single-info:nth-child(2n+1){
  margin-right: 4px;
}
.stock-single-info:nth-child(2n){
  margin-left: 4px;
}
.default-color{
  background-color: #161a23;
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
