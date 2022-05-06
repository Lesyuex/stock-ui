<template>
  <el-carousel indicator-position="none" style="background-color: transparent;height: 420px;margin-top: 8px" :autoplay="false">
    <el-carousel-item v-for="(arr,index) in singleList" :key="index">
      <div class="main-stocks-wrap">
        <div
          v-for="(item) in arr"
          class="stock-single-info"
          :key="item.code"
          @click="checkStock(item.marketCode)">
          <span class="title-wrap">{{ item.name }}</span>
          <span class="index-wrap">
            <i class="el-icon-caret-bottom" v-if="item.upDownValue<0"/>
            <i class="el-icon-minus" v-else-if="item.upDownValue===0"/>
            <i class="el-icon-caret-top" v-else/>
            {{ item.currentPrice }}</span>
          <span class="updown-wrap">{{ item.upDownValue }}&nbsp;{{ item.upDownPercent }}%</span>
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
        {name: '深证成指', marketCode: 'sz399001'},
        {name: '创业板指', marketCode: 'sz399006'},
        {name: '上证50', marketCode: 'sh000016'},
        {name: '沪深300', marketCode: 'sh000300'},
        {name: '科创50', marketCode: 'sh000688'},
        {name: '恒生指数', marketCode: 'hkHSI'},
        {name: '恒生科技指数', marketCode: 'hkHSTECH'}
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
          if (count % 8 === 0) {
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
  height: 420px;
  width: 100%;
  // background-color: #a17f7f;
  padding: 0 8px;
  box-sizing: border-box;
  &::before,&::after{
    content: '';
    display: block;
    clear: both;
  }
}
.main-stocks-wrap .stock-single-info {
  float: left;
  width: calc(50% - 4px);
  height: calc((100% - 24px)/ 4);
  cursor: pointer;
  color: #ffffff;
  text-align: center;
  background-color: #42b983;
  &:nth-child(-n+6){
    margin-bottom: 8px;
  }
  &:nth-child(2n){
    margin-left: 4px;
  }
  &:nth-child(2n+1){
    margin-right: 4px;
  }
  &:nth-child(1){
    border-top-left-radius: 5px;
  }
  &:nth-child(2){
    border-top-right-radius: 5px;
  }
  &:nth-child(7){
    border-bottom-left-radius: 5px;
  }
  &:nth-child(8){
    border-bottom-right-radius: 5px;
  }
  span{
    display: block;
    &.title-wrap {
      height: 30px;
      line-height: 30px;
      font-size: 13px;
    }
    &.index-wrap {
      height: 36px;
      line-height: 36px;
    }
    &.updown-wrap {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
    }
  }
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
/deep/ .el-carousel__container {
  height: 420px !important;
}
</style>
