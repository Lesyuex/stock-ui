<template>
  <div class="main-wrap">
    <div class="title-wrap">
      <div class="single-wrap">
        <span style="font-size: 18px;font-weight: 700" class="fs18 fw700">{{ stock.name }}</span>
        <img src="../../../assets/nation/china.png" alt="123"/>
        <span class="fs14 marginL6 fw500">{{ stock.marketCode }}</span>
      </div>
      <div class="single-wrap">
        <span class="fs22 marginL12 fw700" :style="color">{{ stock.currentPrice || '' }}&nbsp;</span>
      </div>
      <div class="single-wrap">
        <span class="fs14 marginL6 fw500" :style="color">{{ valueChange }}&nbsp;&nbsp;{{ percentChange }}</span>
      </div>
      <el-link :underline="false" class="collect-btn fs12" @click="collectStock">+自选</el-link>
    </div>
    <div class="detail-wrap">
      <div class="box-wrap">
        <span>今开</span><span>{{ stock.todayOpenPrice }}</span>
      </div>

      <div class="box-wrap">
        <span>最高</span><span>{{ stock.highest }}</span>
      </div>
      <div class="box-wrap">
        <span>涨停价</span><span>{{ stock.dailyLimitPrice === -1 ? '0' : stock.dailyLimitPrice }}</span>
      </div>
      <div class="box-wrap">
        <span>成交量</span><span>{{ volume }}</span>
      </div>

      <div class="box-wrap">
        <span>昨收</span><span>{{ stock.yesterdayPrice }}</span>
      </div>
      <div class="box-wrap">
        <span>最低</span><span>{{ stock.lowest.toFixed(2) }}</span>
      </div>
      <div class="box-wrap">
        <span>跌停价</span><span>{{ stock.limitDownPrice === -1 ? '0' : stock.limitDownPrice }}</span>
      </div>

      <div class="box-wrap">
        <span>成交额</span><span>{{ turnOver }}亿</span>
      </div>

      <div class="box-wrap">
        <span>内盘</span><span>{{ inner }}手</span>
      </div>
      <div class="box-wrap">
        <span>均价</span><span>{{ stock.averagePrice }}</span>
      </div>
      <div class="box-wrap">
          <span>市盈
              <el-popover
                placement="right"
                popper-class="peClass"
                trigger="hover">
                <template v-slot="content">
                  <span>市盈<sup style="font-size: 12px;transform: scale(0.4)">TTM</sup>&nbsp;&nbsp;{{ pe.peRate }}</span>
                  <br>
                  <span>市盈<sup style="font-size: 12px;transform: scale(0.4)">动&nbsp;&nbsp;&nbsp;&nbsp;</sup>&nbsp;&nbsp;{{
                      pe.dyPriceRate
                    }}</span>
                    <br>
                  <span>市盈<sup style="font-size: 12px;transform: scale(0.4)">静&nbsp;&nbsp;&nbsp;&nbsp;</sup>&nbsp;&nbsp;{{
                      pe.staPriceRate
                    }}</span>
                </template>
                <span slot="reference"><i class="el-icon-info" style="cursor: pointer"/></span>
              </el-popover>
        </span>
        <span>{{ pe.peRate }}</span>
      </div>
      <div class="box-wrap">
        <span>换手率</span><span>{{ stock.turnoverRate }}%</span>
      </div>


      <div class="box-wrap">
        <span>外盘</span><span>{{ out }}手</span>
      </div>

      <div class="box-wrap">
        <span>振幅</span><span>{{ stock.amplitude }}%</span>
      </div>
      <div class="box-wrap">
        <span>总市值</span>
        <span>{{ stock.marketValue.toFixed(0) }}亿</span>
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
    volume () {
      const volume = this.stock.volume
      if (!volume) return ''
      if (volume >= 100000000) return (volume / 100000000).toFixed(2) + '亿'
      return volume
    },
    turnOver () {
      const turnover = this.stock.turnover
      return turnover ? (turnover / 10000).toFixed(2) : ''
    },
    inner () {
      const innerPlate = this.stock.innerPlate
      if (!innerPlate) return ''
      if (innerPlate > 100000000) return (innerPlate / 100000000).toFixed(2) + '亿'
      if (innerPlate > 10000) return (innerPlate / 10000).toFixed(2) + '万'
      return innerPlate
    },
    out () {
      const outerDisk = this.stock.outerDisk
      if (!outerDisk) return ''
      if (outerDisk > 100000000) return (outerDisk / 100000000).toFixed(2) + '亿'
      if (outerDisk > 10000) return (outerDisk / 10000).toFixed(2) + '万'
      return outerDisk
    },
    valueChange () {
      return this.stock.upDownValue
    },
    percentChange () {
      return `${this.stock.upDownPercent}%`
    },
    color () {
      if (this.valueChange === 0) return ''
      return this.valueChange > 0 ? 'color:#ee4957' : 'color:#01d078'
    }
  },
  methods: {
    collectStock (stock) {
      this.$message.success('恭喜你，请登录！')
    }
  }
}
</script>

<style scoped lang="less">
.main-wrap {
  height: 100%;
  color: #ccc;

  .title-wrap {
    position: relative;
    height: 40px;
    padding: 4px 8px;
    //box-sizing: border-box;
    .single-wrap {
      float: left;
      position: relative;
      line-height: 40px;

      img {
        position: relative;
        left: 3px;
        top: 3px;
        height: 20px;
      }
    }

    .collect-btn {
      position: absolute;
      right: 0;
      top: 18px;
      background-color: #f56c6c;
      color: #fcecff;
      border-radius: 2px;
      padding: 3px 8px;
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
      padding: 0 12px;
      box-sizing: border-box;
      font-size: 13px;

      > span {
        line-height: 20px;
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
