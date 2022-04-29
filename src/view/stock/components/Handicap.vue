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
            <span :style="{backgroundColor: index < 5 ? '#049155' : '#9b3038',width:getWidth(item.volume)}"></span>
            <span>{{ item.volume }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div style="text-align: center;margin:8px 0 12px 0;font-size: 12px">分时成交</div>
    <div class="clinch-class" style="overflow:auto">
      <ul style="height: 100%">
        <li v-for="(item,index) in mingxiArr" :key="index">
          <ul>
            <li class="li-box">{{ item.time.substring(0, 5) }}</li>
            <li class="li-box" style="text-align: center;color: #a4a3a3">{{ item.price }}</li>
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
  data () {
    return {
      max: 0,
      mingxiArr: [],
      loading: false,
      size: 6,
      noMore: false,
      pkList: [
        {name: '卖5', price: '-', volume: '-'},
        {name: '卖4', price: '-', volume: '-'},
        {name: '卖3', price: '-', volume: '-'},
        {name: '卖2', price: '-', volume: '-'},
        {name: '卖1', price: '-', volume: '-'},
        {name: '买1', price: '-', volume: '-'},
        {name: '买2', price: '-', volume: '-'},
        {name: '买3', price: '-', volume: '-'},
        {name: '买4', price: '-', volume: '-'},
        {name: '买5', price: '-', volume: '-'}
      ]
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
    sellWidth () {
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
    disabled () {
      return this.loading || this.noMore
    }
  },
  created () {
    this.initPkList()
    this.refreshData()
  },
  methods: {
    refreshData () {
      const that = this
      this.$axiosGet(`/cn-stock/query/clinch/${this.newestInfo.code}/100`).then(res => {
        this.mingxiArr = res.data
      }).finally(() => {
        if (this.timer) {
          setTimeout(function () {
            that.refreshData()
          }, 3333)
        }
      })
    },
    initPkList () {
      const allVolume = []
      for (let i = 4; i >= 0; i--) {
        this.pkList[i].price = this.newestInfo[`sellPrice${5 - i}`]
        const sellVolume = this.newestInfo[`sellVolume${5 - i}`]
        this.pkList[i].volume = sellVolume

        this.pkList[i + 5].price = this.newestInfo[`buyPrice${i + 1}`]
        const buyVolume = this.newestInfo[`buyVolume${i + 1}`]
        this.pkList[i + 5].volume = buyVolume
        allVolume.push(...[buyVolume, sellVolume])
      }
      this.max = Math.max(...allVolume)
    },
    getWidth (volume) {
      return volume * 100 / this.max + '%'
    },
    getMarkColor (mark) {
      return mark === 'M' ? 'gray' : (mark === 'B' ? '#ee4957' : '#01d078')
    },
    getPriceColor (price) {
      return this.newestInfo.upDownValue === 0 ? 'gray' : (this.newestInfo.upDownValue > 0 ? '#9b3038' : '#049155')
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

      &:nth-child(5) {
        margin-bottom: 8px;
      }

      ul {
        width: 100%;

        li {
          position: relative;
          width: calc(100% / 3);
          margin-bottom: 4px;
          line-height: 14px;
          font-size: 12px;
          height: 14px;

          span:nth-child(1) {
            float: right;
            display: block;
            height: 14px;
          }

          span:nth-child(2) {
            position: absolute;
            top: 0;
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
      width: 0;
      position: absolute;
    }

    &::-webkit-scrollbar-thumb {
      width: 0;
      background-color: rgba(0, 0, 0, .1);
    }

    &::-webkit-scrollbar-track {
      width: 0;
      border-radius: 1px;
      background-color: rgba(0, 0, 0, .3);
    }
  }
}
</style>
