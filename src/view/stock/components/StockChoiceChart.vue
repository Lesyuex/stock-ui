<template>
  <div class="minutes-wrap">
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
    <g-row style="height: 100%;">
      <g-col :md="comInfo.code === '1' ? 20 :24" style="height: 100%;">
        <div class="chart-wrap">
          <keep-alive>
            <component :is="comInfo.com" :stockData="stockData" :marketCode="marketCode" :type="comInfo.type" :ref="comInfo.type"></component>
          </keep-alive>
        </div>
      </g-col>
      <g-col :md="4" v-if="comInfo.code === '1'">
        <handicap :newest-info="stockData.newestInfo" :marketCode="marketCode"></handicap>
      </g-col>
    </g-row>

  </div>
</template>
<script>
import NewestInfo from './NewestInfo'
import Handicap from './Handicap'
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
  components: {Handicap, NewestInfo, MinutesChart, DayKChart, WeekKChart, MonthKChart},
  data () {
    return {
      choiceArr: [
        {name: '分时', com: 'MinutesChart', code: '1', type: 'minu'},
        {name: '五日', com: 'FiveDay', code: '2', type: 'fiveDay'},
        {name: '日K', com: 'DayKChart', code: '3', type: 'day'},
        {name: '周K', com: 'WeekKChart', code: '4', type: 'week'},
        {name: '月K', com: 'MonthKChart', code: '5', type: 'month'}
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
      this.$axiosGet(`/stock/get/minutes/${this.marketCode}`).then(res => {
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
  height: 100%;
  margin: 8px 4px;

  &:before, &:after {
    content: '';
    display: block;
    clear: both;
  }

  > div {
    float: left;
    width: 100%;
  }

  .info-wrap {
    height: 112px;
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
      color: #Ccc;
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

  .chart-wrap {
    height: calc(100% - 156px);
  }
}
</style>
