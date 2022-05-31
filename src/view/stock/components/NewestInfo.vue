<template>
  <div class="main-wrap">
    <div class="title-wrap">
      <span class="stock-name">
          {{ stock.name }}
      </span>
      <img :src="getImg(stock.marketCode)" alt=""/>
      <span>
          {{ stock.marketCode }}
      </span>
      <span :style="color" class="stock-price">
          {{ stock.currentPrice | toFixedTwo }}&nbsp;
      </span>
      <span :style="color" class="stock-change">
          {{ stock.upDownValue | toFixedTwo }}&nbsp;&nbsp;{{ stock.upDownPercent | toFixedTwo(true) }}
      </span>
      <Button type="error" @click="collectStock" size="small" class="collect-btn">加入自选</Button>
    </div>
    <div class="detail-wrap">
      <div class="box-wrap">
        <span>今开</span><span>{{ stock.todayOpenPrice | toFixedTwo }}</span>
      </div>

      <div class="box-wrap">
        <span>最高</span><span>{{ stock.highest | toFixedTwo }}</span>
      </div>
      <div class="box-wrap">
        <span>涨停价</span><span>{{ stock.dailyLimitPrice === -1 ? '0' : stock.dailyLimitPrice }}</span>
      </div>
      <div class="box-wrap">
        <span>成交量</span><span>{{ stock.volume | fomatValue }}</span>
      </div>

      <div class="box-wrap">
        <span>昨收</span><span>{{ stock.yesterdayPrice | toFixedTwo }}</span>
      </div>
      <div class="box-wrap">
        <span>最低</span><span>{{ stock.lowest | toFixedTwo }}</span>
      </div>
      <div class="box-wrap">
        <span>跌停价</span><span>{{ stock.limitDownPrice | toFixedTwo }}</span>
      </div>

      <div class="box-wrap">
        <span>成交额</span><span>{{ stock.turnover | fomatValue }}亿</span>
      </div>

      <div class="box-wrap">
        <span>内盘</span><span>{{ stock.innerPlate | fomatValue }}手</span>
      </div>
      <div class="box-wrap">
        <span>均价</span><span>{{ stock.averagePrice | toFixedTwo }}</span>
      </div>
      <div class="box-wrap">
          <span>市盈
             <Poptip trigger="hover" :title="null" placement="right">
               <sup>
                   <c-icon :name="'info'" size="10"></c-icon>
               </sup>

             <template v-slot:content>
                    <span>市盈<sup style="font-size: 12px;transform: scale(0.4)">TTM</sup>&nbsp;&nbsp;{{
                        pe.peRate
                      }}</span>
                    <br>
                    <span>市盈<sup style="font-size: 12px;transform: scale(0.4)">动&nbsp;&nbsp;&nbsp;&nbsp;</sup>&nbsp;&nbsp;{{
                        pe.dyPriceRate
                      }}</span>
                      <br>
                    <span>市盈<sup style="font-size: 12px;transform: scale(0.4)">静&nbsp;&nbsp;&nbsp;&nbsp;</sup>&nbsp;&nbsp;{{
                        pe.staPriceRate
                      }}</span>
             </template>
        </Poptip>
        </span>
        <span>{{ pe.peRate }}</span>
      </div>
      <div class="box-wrap">
        <span>换手率</span><span>{{ stock.turnoverRate | toFixedTwo }}%</span>
      </div>

      <div class="box-wrap">
        <span>外盘</span><span>{{ stock.outerDisk | fomatValue }}手</span>
      </div>

      <div class="box-wrap">
        <span>振幅</span><span>{{ stock.amplitude | toFixedTwo }}%</span>
      </div>
      <div class="box-wrap">
        <span>总市值</span>
        <span>{{ stock.marketValue | fomatValue }}亿</span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'NewestInfo',
  props: {
    stock: Object
  },
  computed: {
    pe () {
      const peRate = this.stock.peRatio < 0 ? '亏损' : this.stock.peRatio
      const dyPriceRate = this.stock.dyPriceRate < 0 ? '亏损' : this.stock.dyPriceRate
      const staPriceRate = this.stock.staPriceRate < 0 ? '亏损' : this.stock.staPriceRate
      return {peRate, dyPriceRate, staPriceRate}
    },
    color () {
      const value = this.stock.upDownValue
      if (!value || value === 0) return ''
      return value > 0 ? 'color:#ee4957' : 'color:#01d078'
    }
  },
  methods: {
    collectStock (stock) {
      console.log(stock)
      this.$Message.success('恭喜你，请登录！')
    },
    getImg (marketCode) {
      if (!marketCode) return null
      let name
      if (marketCode.indexOf('sh') > -1 || marketCode.indexOf('sz') > -1) {
        name = 'china'
      } else if (marketCode.indexOf('hk') > -1) {
        name = 'hk'
      }
      console.log(name)
      return require(`../../../assets/nation/${name}.png`)
    }
  }
}
</script>

<style scoped lang="less">
.main-wrap {
  height: 100%;

  .title-wrap {
    position: relative;
    //height: 40px;
    padding: 4px 8px;
    //box-sizing: border-box;
    // line-height: 40px;
    span{
      display: inline-block;
      padding-right: 2px;
    }
    img {
      display: inline-block;
      height: 22px;
      vertical-align: text-bottom;
    }
    .stock-name{
      font-size: 18px;
      font-weight: 700;
    }
    .stock-price{
      font-size: 22px;
      font-weight: 700;
    }
    .stock-change{
      font-size: 14px;
    }
    .collect-btn {
      position: absolute;
      right: 8px;
      top: 10px;
      background-color: #ef4257;
      color: #fcecff;
      padding: 0 3px;
    }
  }

  .detail-wrap {
    float: left;
    width: 100%;

    .box-wrap {
      float: left;
      width: 25%;
      display: flex;
      justify-content: space-between;
      padding: 0 12px 1px 12px;
      box-sizing: border-box;
      font-size: 13px;

      > span {
        line-height: 20px;
      }

      /deep/ .ivu-poptip-arrow {
        border-right-color: #1f242a;

        &::after {
          border-right-color: #1f242a;
        }
      }

      /deep/ .ivu-poptip-inner {
        background-color: #1f242a;
        color: white;
      }
    }
  }
}
</style>
<style>
.peClass {
  background-color: #202633;
  color: ghostwhite;
  border-color: #161a23;
  padding: 6px;
  min-width: 120px;
}
</style>
