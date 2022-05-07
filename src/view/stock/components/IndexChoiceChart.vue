<template>
  <div class="minutes-wrap">
    <div class="stock-wrap">
      <div class="info-wrap">
        <newest-info :newestInfo="stockData.newestInfo" :marketCode="marketCode"/>
      </div>
      <div class="choice-wrap">
        <ul>
          <li
            :key="index"
            :class="{'li-active':choice.code === comInfo.code}"
            @click="choiceCom(choice)"
            v-for="(choice,index) in choiceArr">
            {{ choice.name }}
          </li>
        </ul>
      </div>
      <div class="chart-wrap">
        <keep-alive>
          <component :is="comInfo.com" :stockData="stockData"></component>
        </keep-alive>
      </div>
    </div>
    <div class="other-wrap">
      <ul>
        <li
          :key="index"
          :class="{'li-active':other.code === comInfo.code}"
          v-for="(other,index)  in otherArr">
          {{ other.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import NewestInfo from './NewestInfo'
import Handicap from './Handicap'
import MinutesChart from './MinutesChart'
import openTimer from '../../../mixins'

export default {
  mixins: [openTimer],
  name: 'ChoiceChart', // 上下两个grid(分时图和量图)
  props: {
    marketCode: {
      type: String,
      required: true
    }
  },
  components: {Handicap, NewestInfo, MinutesChart},
  data () {
    return {
      choiceArr: [
        {name: '分时', com: 'MinutesChart', code: '1'},
        {name: '五日', com: 'FiveDay', code: '2'},
        {name: '日K', com: '', code: '3'},
        {name: '周K', com: '', code: '4'},
        {name: '月K', com: '', code: '5'}
      ],
      otherArr: [
        {name: '成分股', com: 'MinutesChart', code: '1'}
      ],
      comInfo: {
        com: 'MinutesChart',
        code: '1'
      },
      stockData: {
        newestInfo: {},
        newestMinutes: []
      }
    }
  },
  computed: {
    showHandicap () {
      return this.currentStock.type === 0
    }
  },
  watch: {
    marketCode (newVal, oldVal) {
      this.refreshData()
    }
  },
  mounted () {
    this.refreshData()
    const param = {
      'code': '603138',
      'endDate': '2022-04-29',
      'ktype': 'day',
      'startDate': '2022-04-20',
      'type': 0
    }
    this.$axiosPost('/k/query', param).then(res => {
      console.log(res)
    })
  },
  methods: {
    choiceCom (choice) {
      this.comInfo = {
        com: choice.com,
        code: choice.code
      }
    },
    refreshData () {
      this.getMinutesData()
    },
    getMinutesData () {
      const that = this
      this.$axiosGet(`/index/get/minutes/${this.marketCode}`).then(res => {
        that.stockData = res.data
      }).finally(() => {
        if (this.timer) {
          window.clearTimeout(that.timer)
          that.timer = setTimeout(function () {
            that.refreshData()
          }, 2000)
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.minutes-wrap {
  background-color: #161a23;
  border-radius: 5px;
  height: calc(100vh - 68px);
  min-height: 840px;
  width: calc(100% - 8px);
  margin: 0 4px;

  &:before, &:after {
    content: '';
    display: block;
    clear: both;
  }
  > div {
    float: left;
    width: 100%;
    height: calc(100% / 2);
    box-sizing: border-box;
  }
  .stock-wrap{
    .info-wrap{
      height: 112px;
    }
    .chart-wrap{
      height: calc(100% - 156px);
    }
  }
  ul {
    height: 44px;

    li {
      float: left;
      position: relative;
      list-style: none;
      padding: 8px 12px;
      line-height: 28px;
      cursor: pointer;
      font-size: 15px;
    }

    .li-active {
      color: lightskyblue;

      &::after {
        content: '';
        display: block;
        position: absolute;
        width: 12px;
        bottom: 8px;
        height: 2px;
        left: calc(50% - 6px);
        background-color: skyblue;
      }
    }
  }
}
</style>
