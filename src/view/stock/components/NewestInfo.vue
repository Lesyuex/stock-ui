<template>
  <div class="main-wrap">
    <div class="title-wrap">
      <div class="single-wrap">
        <span class="fs22 fw700">{{ newestInfo.name }}</span>
        <img src="../../../assets/nation/china.png"/>
        <span class="fs14 marginL6 fw500">{{ marketCode }}</span>
      </div>
      <div class="single-wrap">
        <span class="fs22 marginL12 fw700" :style="color">{{ newestInfo.currentPrice || '' }}&nbsp;</span>
      </div>
      <div class="single-wrap">
        <span class="fs14 marginL6 fw500" :style="color">{{ valueChange }}&nbsp;&nbsp;{{ percentChange }}</span>
      </div>
      <el-link :underline="false" class="collect-btn fs12">+自选</el-link>
    </div>
    <div class="detail-wrap">
      <div>
        <span>今<span class="ti1em">开</span></span><span>{{ newestInfo.todayOpenPrice }}</span>
      </div>
      <div>
        <span>最<span class="ti1em">高</span></span><span>{{ newestInfo.highest }}</span>
      </div>
      <div>
        <span>涨停价</span><span>{{ newestInfo.dailyLimitPrice === -1 ? '0' : newestInfo.dailyLimitPrice }}</span>
      </div>

      <div>
        <span>成交量</span><span>{{ volume }}手</span>
      </div>
      <div>
        <span>内<span class="ti1em">盘</span></span><span>{{ inner }}手</span>
      </div>
      <div>
        <span>昨<span class="ti1em">收</span></span><span>{{ newestInfo.yesterdayPrice }}</span>
      </div>
      <div>
        <span>最<span class="ti1em">低</span></span><span>{{ newestInfo.lowest }}</span>
      </div>
      <div>
        <span>跌停价</span><span>{{ newestInfo.limitDownPrice === -1 ? '0' : newestInfo.limitDownPrice }}</span>
      </div>
      <div>
        <span>成交额</span><span>{{ turnOver }}亿</span>
      </div>
      <div>
        <span>外<span class="ti1em">盘</span></span><span>{{ out }}手</span>
      </div>

      <div>
        <span>换手率</span><span>{{ newestInfo.turnoverRate }}%</span>
      </div>
      <div>
        <span>振<span class="ti1em">幅</span></span><span>{{ newestInfo.amplitude }}%</span>
      </div>
      <div>
        <span>均<span class="ti1em">价</span></span><span>{{ newestInfo.averagePrice }}</span>
      </div>
      <div>
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
        <span>
          {{ pe.peRate }}
        </span>
      </div>

      <div>
        <span>总市值</span><span>{{ (newestInfo.marketValue * 1).toFixed(2) }}亿</span>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'NewestInfo',
  props: {
    newestInfo: Object,
    marketCode: String
  },
  computed: {
    pe () {
      const peRate = this.newestInfo.peRatio < 0 ? '亏损' : this.newestInfo.peRatio
      const dyPriceRate = this.newestInfo.dyPriceRate < 0 ? '亏损' : this.newestInfo.dyPriceRate
      const staPriceRate = this.newestInfo.staPriceRate < 0 ? '亏损' : this.newestInfo.staPriceRate
      return {peRate, dyPriceRate, staPriceRate}
    },
    volume () {
      const volume = this.newestInfo.volume
      if (!volume) return ''
      if (volume > 100000000) return (volume / 100000000).toFixed(2) + '亿'
      if (volume > 10000) return (volume / 10000).toFixed(0) + '万'
      return volume
    },
    turnOver () {
      const turnover = this.newestInfo.turnover
      return turnover ? (turnover / 10000).toFixed(2) : ''
    },
    inner () {
      const innerPlate = this.newestInfo.innerPlate
      if (!innerPlate) return ''
      if (innerPlate > 100000000) return (innerPlate / 100000000).toFixed(2) + '亿'
      if (innerPlate > 10000) return (innerPlate / 10000).toFixed(2) + '万'
      return innerPlate
    },
    out () {
      const outerDisk = this.newestInfo.outerDisk
      if (!outerDisk) return ''
      if (outerDisk > 100000000) return (outerDisk / 100000000).toFixed(2) + '亿'
      if (outerDisk > 10000) return (outerDisk / 10000).toFixed(2) + '万'
      return outerDisk
    },
    updownValue () {
      return this.newestInfo.upDownValue
    },
    stockMarket () {
      return 'sh'
    },
    valueChange () {
      return this.updownValue ? (this.updownValue < 0 ? `-${this.updownValue}` : `+${this.updownValue}`) : ''
    },
    percentChange () {
      return this.updownValue ? (this.updownValue < 0 ? `-${this.newestInfo.upDownPercent}%` : `+${this.newestInfo.upDownPercent}%`) : ''
    },
    color () {
      if (this.updownValue === 0) return ''
      return this.updownValue > 0 ? 'color:#ee4957' : 'color:#01d078'
    }
  }
}
</script>

<style scoped lang="less">
.main-wrap {
  padding: 0 12px;
  height: 100%;
  box-sizing: border-box;
color:#ccc;
  .title-wrap {
    position: relative;
    height: 40px;

    .single-wrap {
      float: left;
      position: relative;
      line-height: 40px;
      padding: 5px 0;

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
    &::before, &::after {
      content: '';
      display: block;
      clear: both;
    }

    div {
      float: left;
      display: flex;
      justify-content: space-between;
      width: 20%;
      font-size: 15px;
      box-sizing: border-box;
      padding-right: 20px;

      &:nth-child(5), &:nth-child(10), &:nth-child(15) {
        padding-right: 0;
      }

      span {
        display: inline-block;
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
