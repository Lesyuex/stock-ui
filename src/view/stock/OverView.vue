<template>
  <div class="carousel-wrap">
    <el-carousel indicator-position="none" style="background-color: transparent;height: 100%;" :autoplay="false">
      <el-carousel-item v-for="(arr,index) in singleList" :key="index">
        <div class="main-stocks-wrap">
          <div
            v-for="(item) in arr"
            :class="{'stock-single-info':true,'green-class':item.upDownValue<0,'red-class':item.upDownValue>0,'default-class':item.upDownValue===0}"
            :key="item.code"
            @click="checkStock(item.marketCode)">
            <div class="title-wrap fs13">{{ item.name }}</div>
            <div class="index-wrap">
              <i class="el-icon-caret-bottom" v-if="item.upDownValue<0"/>
              <i class="el-icon-minus" v-else-if="item.upDownValue===0"/>
              <i class="el-icon-caret-top" v-else/>
              {{ item.currentPrice }}
            </div>
            <div class="updown-wrap fs12">{{ item.upDownValue }}&nbsp;{{ item.upDownPercent }}%</div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import SingleMinutesLineChart from '../../components/chart/SingleMinutesLineChart'
import Chart from '../test/Chart'
import openTimer from '../../mixins'

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
        {name: '上证指数', marketCode: 'sh000001', currentPrice: '-', upDownValue: '-', upDownPercent: '-'},
        {name: '深证成指', marketCode: 'sz399001', currentPrice: '-', upDownValue: '-', upDownPercent: '-'},
        {name: '创业板指', marketCode: 'sz399006', currentPrice: '-', upDownValue: '-', upDownPercent: '-'},
        {name: '上证50', marketCode: 'sh000016', currentPrice: '-', upDownValue: '-', upDownPercent: '-'},
        {name: '沪深300', marketCode: 'sh000300', currentPrice: '-', upDownValue: '-', upDownPercent: '-'},
        {name: '科创50', marketCode: 'sh000688', currentPrice: '-', upDownValue: '-', upDownPercent: '-'},
        {name: '恒生指数', marketCode: 'hkHSI', currentPrice: '-', upDownValue: '-', upDownPercent: '-'},
        {name: '恒生科技指数', marketCode: 'hkHSTECH', currentPrice: '-', upDownValue: '-', upDownPercent: '-'}
      ],
      singleList: [],
      marketCode: 'sh000001'
    }
  },
  created () {
    this.getSingleInfo()
  },
  methods: {
    refreshData () {
      this.getSingleInfo()
    },
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
        for (let i = 0; i < this.indexList.length; i++) {
          const source = this.indexList[i]
          const target = Object.assign(source, data[i])
          const count = i + 1
          arr.push(target)
          if (count % 8 === 0) {
            singleList.push(arr)
            arr = []
          }
        }
      }).finally(() => {
        this.singleList = singleList.length === 0 ? [this.indexList] : singleList
        if (this.timer) {
          window.clearTimeout(that.timer)
          that.timer = setTimeout(function () {
            that.refreshData()
          }, 3000)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.carousel-wrap {
  height: 486px;
  box-sizing: border-box;
  color: #ffffff !important;
  .main-stocks-wrap {
    height: 100%;

    &::before, &::after {
      content: '';
      display: block;
      clear: both;
    }

    .stock-single-info {
      float: left;
      width: calc(50% - 4px);
      height: calc((100% - 24px) / 4);
      cursor: pointer;

      text-align: center;
      background-color: #42b983;

      &:nth-child(-n+6) {
        margin-bottom: 8px;
      }

      &:nth-child(2n) {
        margin-left: 4px;
      }

      &:nth-child(2n+1) {
        margin-right: 4px;
      }

      &:nth-child(1) {
        border-top-left-radius: 5px;
      }

      &:nth-child(2) {
        border-top-right-radius: 5px;
      }

      &:nth-child(7) {
        border-bottom-left-radius: 5px;
      }

      &:nth-child(8) {
        border-bottom-right-radius: 5px;
      }

      > div {
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        &.title-wrap, &.updown-wrap {
          height: 30%;
        }

        &.index-wrap {
          height: 40%;
          i{
            color: white;
          }
        }
      }
    }
  }

  .default-color {
    background-color: lightgray;
  }

  .green-class {
    background: linear-gradient(to bottom, #1d9a63, 100%, #161a23);
  }

  .red-class {
    background: linear-gradient(to bottom, #ef4257, 100%, #161a23);
  }

  /deep/ .el-carousel__container {
    height: 100% !important;
  }
}
</style>
