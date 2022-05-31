<template>
  <div id="contain-wrap">
    <h3 class="title-wrap">成分股</h3>
    <ul class="nav-wrap">
      <li>
        <span>股票名称</span>
      </li>
      <li>
        <span>最新价</span>
        <svg-icon icon-name="sort" class-name="sort-class"></svg-icon>
      </li>
      <li>
        <span>涨跌幅</span>
        <svg-icon icon-name="sort-check" class-name="sort-class"></svg-icon>
      </li>
      <li>
        <span>换手率</span>
        <svg-icon icon-name="sort" class-name="sort-class"></svg-icon>
      </li>
    </ul>
    <ul class="scroll-wrap" id="index-wrap">
      <li v-for="(stock, index) in indexList" :key="index" class="stock-li">
        <div class="content-wrap">
          <!--股票名称-->
          <div class="name-wrap">
            <div>
              <img
                src="../../assets/nation/china.png"
                alt="股票"
                style="height: 16px;vertical-align: middle;">
              {{ stock.name }}
            </div>
            <div>
              {{ stock.marketCode }}
            </div>
            <span style="position: absolute;left: 88px;bottom: 2px;font-size: 12px">
              <svg-icon iconName='fast' className='icon'></svg-icon>&nbsp;快速上涨
            </span>
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
        </div>
      </li>
    </ul>
    <c-icon
      :name="'loading-one'"
      class="loading-data"
      v-if="loadingData"/>
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
        {name: '恒生科技指数', marketCode: 'hkHSTECH', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false},
        {name: '上证指数', marketCode: 'sh000001', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false},
        {name: '深证成指', marketCode: 'sz399001', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false},
        {name: '创业板指', marketCode: 'sz399006', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false},
        {name: '上证50', marketCode: 'sh000016', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false},
        {name: '沪深300', marketCode: 'sh000300', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false},
        {name: '科创50', marketCode: 'sh000688', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false},
        {name: '恒生指数', marketCode: 'hkHSI', currentPrice: '-', upDownValue: '-', upDownPercent: '-', fast: false}
      ],
      marketCode: 'sh000001',
      breathTimer: null,
      breathLiIndexArr: [],
      liArr: [],
      loadingData: false
    }
  },
  created () {
    this.getSingleInfo()
  },
  mounted () {
    const self = this
    const dom = document.getElementById('contain-wrap')
    this.liArr = dom.getElementsByClassName('stock-li')
    const scorllDom = document.getElementById('index-wrap')
    // 防抖
    let timer = null
    scorllDom.addEventListener('scroll', function () {
      if (timer !== null) window.clearTimeout(timer)
      timer = setTimeout(function () {
        console.log(scorllDom.clientHeight - scorllDom.scrollTop)
        if (scorllDom.clientHeight - scorllDom.scrollTop < 12) {
          self.getMore()
        }
      }, 500)
    },false)
  },
  methods: {
    getMore () {
      const self = this
      self.loadingData = true
      return new Promise(resolve => {
        setTimeout(function () {
          self.loadingData = false
        }, 3000)
        resolve()
      })
    },
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
          if (this.timer !== null) window.clearTimeout(this.timer)
          this.timer = setTimeout(function () {
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
  height: 494px;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: #1a2029;
  padding: 0 4px;

  .title-wrap {
    padding: 8px;
    font-size: 18px;
    line-height: 30px;
  }

  ul {
    list-style: none;

    li {
      position: relative;
      height: 56px;
      transition: .3s;
      cursor: pointer;
      //border-bottom: 1px solid rgba(0, 0, 0, 0);
      .content-wrap {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        padding-left: 12px;
        box-sizing: border-box;

        .name-wrap {
          position: relative;
          flex: 6;
        }

        .change-wrap {
          flex: 3;
          line-height: 56px;
          text-align: center;
        }

        .name-wrap {
          > div {
            &:nth-child(1) {
              font-size: 15px;
              line-height: 36px;
            }

            &:nth-child(2) {
              font-size: 14px;
              line-height: 20px;
            }
          }
        }
      }
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

  .scroll-wrap {
    height: 410px;
    overflow: auto;
    overflow-y: overlay;
  }

  .nav-wrap {
    padding-left: 12px;
    display: flex;
    justify-content: space-between;

    li {
      position: relative;
      flex: 3;
      height: 30px;
      line-height: 30px;
      text-align: center;

      &:nth-child(1) {
        flex: 6;
        text-align: left;
      }

      .sort-class {
        width: 14px;
        height: 14px;
      }

      .sort-down {
        transform: rotate(180deg);
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
  width: 14px;
  height: 14px;
  font-size: 14px
}
</style>
