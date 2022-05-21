<template>
  <div class="market-wrap">
    <h3 style="padding: 8px">指数</h3>
    <ul id="index-wrap">
      <li v-for="(stock, index) in indexList" :key="index">
        <div class="content-wrap">
          <div>
            <span style="font-size: 16px;line-height: 20px">
           {{stock.name}}
            <img src="../../assets/nation/china.png"
                 style="height: 11px;vertical-align: middle;margin-left: 6px">
            </span>
            <span style="display:block;font-size: 14px;line-height: 18px">{{stock.marketCode}}</span>
          </div>
          <div >
            <span style="float: left">{{ stock.currentPrice }}</span>
          </div>
          <div >
            <span style="float: right">{{ stock.upDownPercent }}%</span>
          </div>
        </div>
        <div class="collect-wrap">
          <i class="el-icon-circle-plus-outline"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import openTimer from '../../mixins'
import SingleMinutesLineChart from '../../components/chart/SingleMinutesLineChart'
import Chart from '../test/Chart'

export default {
  mixins: [openTimer],
  name: 'Market',
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
      marketCode: 'sh000001',
      breathTimer: null,
      breathLiIndexArr: [],
      liArr: []
    }
  },
  created () {
    this.getSingleInfo()
  },
  mounted () {
    const dom = document.getElementById('index-wrap')
    this.liArr = dom.getElementsByTagName('li')
  },
  methods: {
    breath () {
      const that = this
      setInterval(function () {
        const breathLiIndexArr = []
        for (let i = 0; i < that.indexList.length; i++) {
          // 把需要呼吸的股票找出来
          const change = Math.round(Math.random())
          if (change === 1) breathLiIndexArr.push(i)
        }
        that.breathLiIndexArr = breathLiIndexArr
        console.log(breathLiIndexArr.join(','))
        console.log(that.liArr)
        for (let i = 0; i < breathLiIndexArr.length; i++) {
          const index = breathLiIndexArr[i]
          const dom = that.liArr[index]
          setTimeout(function (){
            dom.classList.add('breath-li')
          },i*100)

          setTimeout(function () {
            dom.classList.remove('breath-li')
          }, 2000 + i*100)
        }
      }, 5000)
    },
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
      this.$axiosGet(`/stock/get/single/${codes}`).then(res => {
        const data = res.data
        const breathLiIndexArr = []
        for (let i = 0; i < this.indexList.length; i++) {
          const source = this.indexList[i]
          Object.assign(source, data[i])
          // 把需要呼吸的股票找出来
          const change = Math.round(Math.random())
          if (change === 1) breathLiIndexArr.push(i)
        }
        this.breathLiIndexArr = breathLiIndexArr
      }).finally(() => {
        this.$nextTick(function () {
          this.breath()
        })
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
.market-wrap {
  position: relative;

  height: calc((100vh - 68px) / 2);
  min-height: 420px;

  border-radius: 5px;
  background-color: #1e2d44;

  ul {
    list-style: none;

    li {
      position: relative;
      padding: 4px 8px;
      height: 40px;
      transition: .3s;
      &::after{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
        opacity: 0;
        // animation: breath 3s ease-in-out;
      }
      .content-wrap {
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        width: 80%;
        box-sizing: border-box;
        cursor: pointer;
        >div{
          line-height: 40px;
          &:nth-child(1){
            line-height: 20px;
          }
        }
      }
      .collect-wrap{
        position: absolute;
        right: 5%;
        top: 12px;
        i{
          font-size: 20px;
          cursor: pointer;
        }
      }
    }
    .breath-li{
      animation: breath 2s ease-in-out;
    }
  }
}
@keyframes breath {
  from{

  }to{
       background-color: rgba(0,0,0,.3);
 }
}
</style>
