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
          <component :is="comInfo.com" :stockData="stockData" :marketCode="marketCode" :type="comInfo.type" :ref="comInfo.type"></component>
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
import MinutesChart from '../../../components/chart/MinutesChart'
import openTimer from '../../../mixins'
import DayKChart from '../../../components/chart/DayKChart'
import WeekKChart from '../../../components/chart/WeekKChart'
import MonthKChart from '../../../components/chart/MonthKChart'
export default {
  mixins: [openTimer],
  name: 'ChoiceChart', // 上下两个grid(分时图和量图)
  props: {
    marketCode: {
      type: String,
      required: true
    }
  },
  components: {NewestInfo, MinutesChart, DayKChart, WeekKChart, MonthKChart},
  data () {
    return {
      choiceArr: [
        {name: '分时', com: 'MinutesChart', code: '1', type: 'minu'},
        {name: '五日', com: 'FiveDay', code: '2', type: 'fiveDay'},
        {name: '日K', com: 'DayKChart', code: '3', type: 'day'},
        {name: '周K', com: 'WeekKChart', code: '4', type: 'week'},
        {name: '月K', com: 'MonthKChart', code: '5', type: 'month'}
      ],
      otherArr: [
        {name: '成分股', com: 'MinutesChart', code: '1'}
      ],
      comInfo: {
        com: 'MinutesChart',
        code: '1',
        type: 'minu'
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
    marketCode () {
      this.refreshData()
    }
  },
  mounted () {
    this.refreshData()
  },
  methods: {
    choiceCom (choice) {
      this.comInfo = {
        com: choice.com,
        code: choice.code,
        type: choice.type
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
        this.$refs[this.comInfo.type].loadingData = false
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
