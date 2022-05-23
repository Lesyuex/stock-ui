<template>
  <div id="contain-wrap">
    <div class="title-wrap">成分股</div>
    <ul id="index-wrap">
<!--      <li>
        <div class="content-wrap">
          &lt;!&ndash;股票名称&ndash;&gt;
          <div class="name-wrap" style="line-height: 56px">
            股票名称
          </div>
          &lt;!&ndash;股价涨跌幅&ndash;&gt;
          <div class="change-wrap">
            <span>最新价</span>
          </div>
          <div class="change-wrap">
            <span>涨跌幅</span>
          </div>
          <div class="change-wrap">
            <span>换手率</span>
          </div>
          &lt;!&ndash;收藏 &ndash;&gt;
          <div class="collect-wrap">
          </div>
        </div>
      </li>-->
      <li v-for="(stock, index) in indexList" :key="index" class="stock-li">
        <div class="content-wrap">
          <!--股票名称-->
          <div class="name-wrap">
            <span>
               <img
                 src="../../assets/nation/china.png"
                 style="height: 16px;vertical-align: middle;">
              {{ stock.name }}

            </span>
            <span>{{ stock.marketCode }}</span>
            <div v-show="stock.fast" style="position: absolute;right: 0;top: 18px;font-size: 15px">
              <svg-icon iconClass='fast' className='icon'></svg-icon>&nbsp;快速上涨
            </div>
          </div>
          <!--股价涨跌幅-->
          <div class="change-wrap" :style="{color:stock.upDownPercent > 0 ? '#ee4957' : '#01d078'}">
            <span>{{ stock.currentPrice }}</span>
          </div>
          <div class="change-wrap">
            <span :style="{color:stock.upDownPercent > 0 ? '#ee4957' : '#01d078'}">{{ stock.upDownValue }}</span>
          </div>
          <div class="change-wrap">
            <span :style="{color:stock.upDownPercent > 0 ? '#ee4957' : '#01d078'}">{{ stock.upDownPercent }}%</span>
          </div>
          <!--收藏 -->
          <div class="collect-wrap">
            <i class="el-icon-circle-plus-outline"></i>
          </div>
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
  name: 'ContainStock',
  components: {
    SingleMinutesLineChart,
    Chart
  },
  data () {
    return {
      indexList: [
        {name: '上证指数', marketCode: 'sh000001', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false},
        {name: '深证成指', marketCode: 'sz399001', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false},
        {name: '创业板指', marketCode: 'sz399006', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false},
        {name: '上证50', marketCode: 'sh000016', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false},
        {name: '沪深300', marketCode: 'sh000300', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false},
        {name: '科创50', marketCode: 'sh000688', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false},
        {name: '恒生指数', marketCode: 'hkHSI', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false},
        {name: '恒生科技指数', marketCode: 'hkHSTECH', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false}
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
    const dom = document.getElementById('contain-wrap')
    this.liArr = dom.getElementsByClassName('stock-li')
  },
  methods: {
    breath () {
      const that = this
      for (let i = 0; i < that.breathLiIndexArr.length; i++) {
        const index = that.breathLiIndexArr[i]
        const dom = that.liArr[index]
        dom.classList.add('breath-li')
        setTimeout(function () {
          dom.classList.remove('breath-li')
        }, 1500)
      }
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
          // 把需要呼吸的股票找出来
          const number = Math.abs(source.upDownPercent - data[i].upDownPercent)
          if (number >= 0.2) breathLiIndexArr.push(i)
          // 判断是否快速上涨或下跌
          if (number >= 0.02) source.fast = true
          Object.assign(source, data[i])
        }
        this.breathLiIndexArr = breathLiIndexArr
      }).finally(() => {
        this.$nextTick(function () {
          this.breath()
        })
        if (this.timerIsOpen) {
          setTimeout(function () {
            that.refreshData()
          }, 3000)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
#contain-wrap {
  position: relative;
  height: 510px;
  padding: 10px 0;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: #1e2d44;

  .title-wrap {
    height: 40px;
    font-weight: 700;
    padding-left: 12px;
    box-sizing: border-box;
    font-size: 22px;
    padding-bottom: 4px;
  }

  ul {
    list-style: none;
    overflow: auto;

    li {
      position: relative;
      height: 56px;
      transition: .3s;
      cursor: pointer;
      border-bottom: 1px solid rgba(0,0,0,.1);
  /*    &:nth-child(1){
        border-top: 1px solid rgba(0,0,0,.05);
        font-size: 18px;
      }*/
      .content-wrap {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        padding-left: 12px;
        box-sizing: border-box;
        .name-wrap{
          position: relative;
          flex: 5;
        }
        .change-wrap {
          flex: 3;
          line-height: 56px;
          text-align: center;
        }
        .name-wrap{
          span{
            display: block;
            &:nth-child(1){
              font-size: 15px;
              line-height: 36px;
            }
            &:nth-child(2){
              font-size: 14px;
              line-height: 20px;
            }
          }
        }
        .collect-wrap{
          flex: 2;
          display: flex;
          justify-content: center;
          align-items: center;
          i{
            font-size: 20px;
          }
        }
      }

    /*  .collect-wrap {
        position: absolute;
        right: 5%;
        top: 12px;

        i {
          font-size: 20px;
          cursor: pointer;
        }
      }*/
    }

    .breath-li {
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        background-color: rgba(0, 0, 0, .2);
        animation: breath 1.5s linear;
      }
    }
  }
}

@keyframes breath {
  0% {
  }
  50% {
    opacity: 1;
  }
  100% {
  }
}
.icon {
  width: 15px;
  height: 15px;
  font-size: 15px
}
</style>
