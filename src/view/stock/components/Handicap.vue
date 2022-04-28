<template>
  <div class="hand-cap">
    <div class="pk-bar">
      <span style="left: 0">买</span>
      <div :style="{width: `calc(100% - ${sellWidth} - 12px)`}" class="buy-bar"></div>
      <div :style="{width: `calc(${sellWidth} - 12px)`,}" class="sell-bar"></div>
      <span style="right: 0">卖</span>
    </div>
    <ul class="pk-class">
      <li v-for="(item,index) in pkList" :key="index">
        <ul>
          <li class="li-box">{{ item.name }}</li>
          <li class="li-box" :style="{color:getPriceColor(item.price),fontWeight: 600,textAlign:'center'}">
            {{ item.price.toFixed(2) }}
          </li>
          <li class="li-box" style="color: whitesmoke;text-align:right">
            <span :style="{backgroundColor:getPriceColor(item.price),width:getWidth(item.volume)}"></span>
            <span >{{ item.volume }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--    <div  >
          <div style="">{{ item.name }}</div>
          <div </div>
          <div style="height: 100%">
            <div
              :style="{backgroundColor:getPriceColor(item.price),width:getWidth(item.volume),height:'100%',float:'right'}"></div>
            <div style="color: whitesmoke;background-color: transparent;position: absolute;right: 0">{{ item.volume }}</div>
          </div>
        </div>-->
    <div style="text-align: center;margin:8px 0 12px 0;font-size: 12px">分时成交</div>
    <div class="clinch-class" style="overflow:auto">
      <ul style="height: 100%">
        <li v-for="(item,index) in mingxiArr" :key="index">
          <ul>
            <li class="li-box">{{ item.time.substring(0, 5) }}</li>
            <li class="li-box" style="text-align: center;color: #a4a3a3">{{ item.price.toFixed(2) }}</li>
            <li class="li-box" style="text-align: right;color: #a4a3a3">{{ item.volume }} <span
              :style="{color:getMarkColor(item.mark)}">{{ item.mark }}</span></li>
          </ul>
        </li>
      </ul>
      <p style="font-size: 12px;text-align: center">暂仅支持查询100条数据</p>
    </div>
  </div>
</template>

<script>
import openTimer from '../../../mixins'

export default {
  mixins: [openTimer],
  name: 'Handicap',
  props: {
    newestInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      pkList: [],
      max: 0,
      mingxiArr: [],
      loading: false,
      size: 6,
      noMore: false
    }
  },
  watch: {
    newestInfo: {
      deep: true,
      handler: function (val) {
        this.initPkList()
      }
    }
  },
  computed: {
    sellWidth() {
      let num = 0
      let sell = 0
      this.pkList.filter((item, index) => {
        num += item.volume
        if (index <= 2) {
          sell += item.volume
        }
      })
      return sell * 100 / num + '%'
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  created() {
    this.initPkList()
    this.refreshData()
  },
  methods: {
    refreshData() {
      const that = this
      console.log(this.newestInfo)
      this.$axiosGet(`/cn-stock/query/clinch/${this.newestInfo.code}/100`).then(res => {
        this.mingxiArr = res.data
      }).finally(() => {
        if (this.timer) {
          setTimeout(function () {
            that.refreshData()
          }, 2000)
        }
      })
    },
    initPkList() {
      const sellFifthVolume = this.newestInfo.sellFifthVolume
      const sellForthVolume = this.newestInfo.sellForthVolume
      const sellThirdVolume = this.newestInfo.sellThirdVolume
      const sellSecondVolume = this.newestInfo.sellSecondVolume
      const sellFirstVolume = this.newestInfo.sellFirstVolume
      const buyFirstVolume = this.newestInfo.buyFirstVolume
      const buySecondVolume = this.newestInfo.buySecondVolume
      const buyThirdVolume = this.newestInfo.buyThirdVolume
      const buyForthVolume = this.newestInfo.buyForthVolume
      const buyFifthVolume = this.newestInfo.buyFifthVolume
      const allVolume = [sellFifthVolume, sellForthVolume, sellThirdVolume, sellSecondVolume, sellFirstVolume, buyFirstVolume, buySecondVolume, buyThirdVolume, buyForthVolume, buyFifthVolume]
      this.max = Math.max(...allVolume)
      this.pkList = [
        {name: '卖5', price: this.newestInfo.sellFirstPrice, volume: sellFifthVolume},
        {name: '卖4', price: this.newestInfo.sellSecondPrice, volume: sellForthVolume},
        {name: '卖3', price: this.newestInfo.sellThirdPrice, volume: sellThirdVolume},
        {name: '卖2', price: this.newestInfo.sellForthPrice, volume: sellSecondVolume},
        {name: '卖1', price: this.newestInfo.sellFifthPrice, volume: sellFirstVolume},
        {name: '买1', price: this.newestInfo.buyFirstPrice, volume: buyFirstVolume},
        {name: '买2', price: this.newestInfo.buySecondPrice, volume: buySecondVolume},
        {name: '买3', price: this.newestInfo.buyThirdPrice, volume: buyThirdVolume},
        {name: '买4', price: this.newestInfo.buyForthPrice, volume: buyForthVolume},
        {name: '买5', price: this.newestInfo.buyFifthPrice, volume: buyFifthVolume}
      ]
    },
    getWidth(volume) {
      return volume * 100 / this.max + '%'
    },
    getMarkColor(mark) {
      return mark === 'M' ? 'gray' : (mark === 'B' ? '#ee4957' : '#01d078')
    },
    getPriceColor(price) {
      const diff = this.newestInfo.upDownValue
      return diff === 0 ? 'gray' : (diff > 0 ? '#9b3038' : '#049155')
    }
  }
}
</script>

<style scoped lang="less">
@grayColor: #cccccc;
.hand-cap {
  float: left;
  height: 100%;
  width: 100%;
  padding-top: 10px;
  box-sizing: border-box;

  > div {
    float: left;
    width: 100%;
  }

  .pk-bar {
    position: relative;
    height: 10px;
    font-size: 12px;
    color: #fff;
    line-height: 12px;
    margin-bottom: 10px;

    span {
      position: absolute;
    }

    span:nth-child(1) {
      text-align: right;
    }

    div {
      float: left;
      position: relative;
      left: 12px;
      height: 100%;
    }

    .buy-bar {
      background-color: #b63744;
    }

    .sell-bar {
      background-color: #049f5d;
    }
  }

  > div:nth-of-type(6) {
    margin-bottom: 12px;
  }

  .pk-class {
    position: relative;
    margin-bottom: 4px;
    float: left;
    width: 100%;
    &::before, &::after {
      content: '';
      display: block;
      clear: both;
    }
    li {
      float: left;
      width: 100%;
      list-style: none;
      ul {
        width: 100%;
        li {
          position: relative;
          width: calc(100% / 3);
          margin-bottom: 4px;
          line-height: 14px;
          font-size: 12px;
          height: 14px;
          span:nth-child(1){
            float: right;
            display: block;
            height: 14px;
          }
          span:nth-child(2){
            position: absolute;
            top:0;
            right: 0;
            width: 100%;
            height: 100%;
            text-align: right
          }

        }
      }
    }

    div:nth-child(1) {
      text-align: left;
    }

    div:nth-child(2) {
      text-align: center;
    }

    div:nth-child(3) {
      text-align: right;
    }

  }

  .clinch-class {
    overflow-y: scroll;
    height: 130px;

    ul .li-box {
      width: calc(100% / 3);
      list-style: none;
      float: left;
      font-size: 12px;
    }

    &::-webkit-scrollbar {
      width: 0px;
      position: absolute;
    }

    &::-webkit-scrollbar-thumb {
      width: 0px;
      background-color: rgba(0, 0, 0, .1);
    }

    &::-webkit-scrollbar-track {
      width: 0px;
      border-radius: 1px;
      background-color: rgba(0, 0, 0, .3);
    }
  }
}
</style>
