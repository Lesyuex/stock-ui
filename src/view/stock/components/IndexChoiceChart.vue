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
          <li>
            <el-dropdown>
            <span class="el-dropdown-link">
              更多<el-icon class="el-icon-caret-bottom"/>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="minu in moreChoice" :key="minu.code">{{ minu.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li style="float: right">
            <el-icon class="el-icon-setting"/>
          </li>
        </ul>
      </div>
      <div class="chart-wrap">
        <keep-alive>
          <component :is="comInfo.com" :stockData="stockData" :marketCode="marketCode" :comInfo="comInfo"
                     :ref="comInfo.kname" :refName="comInfo.kname"/>
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

export default {
  mixins: [openTimer],
  name: 'ChoiceChart', // 上下两个grid(分时图和量图)
  props: {
    marketCode: {
      type: String,
      required: true
    }
  },
  components: {
    NewestInfo,
    MinutesChart,
    FiveDayMinutesChart: () => import('../../../components/chart/FiveDayMinutesChart'),
    DayKChart: () => import('../../../components/chart/KChart'),
    WeekKChart: () => import('../../../components/chart/KChart'),
    MonthKChart: () => import('../../../components/chart/KChart'),
    SeasonChart: () => import('../../../components/chart/KChart'),
    YearChart: () => import('../../../components/chart/KChart')
  },
  data () {
    return {
      choiceArr: [
        {name: '分时', com: 'MinutesChart', code: '1', kname: 'minu', ktype: 0},
        {name: '五日', com: 'FiveDayMinutesChart', code: '2', kname: 'fiveDay', ktype: 0},
        {name: '日K', com: 'DayKChart', code: '3', kname: 'day', ktype: 0},
        {name: '周K', com: 'WeekKChart', code: '4', kname: 'week', ktype: 0},
        {name: '月K', com: 'MonthKChart', code: '5', kname: 'month', ktype: 0},
        {name: '季K', com: 'SeasonChart', code: '6', kname: 'season', ktype: 0},
        {name: '年K', com: 'YearChart', code: '7', kname: 'year', ktype: 0}
      ],
      moreChoice: [
        {name: '1分', com: 'MinutesChart', code: '1', kname: 'm1', ktype: 1},
        {name: '5分', com: 'FiveDay', code: '2', kname: 'm5', ktype: 1},
        {name: '15分', com: 'DayKChart', code: '3', kname: 'm15', ktype: 1},
        {name: '30分', com: 'WeekKChart', code: '4', kname: 'm30', ktype: 1},
        {name: '60分', com: 'MonthKChart', code: '5', kname: 'm60', ktype: 1},
        {name: '120分', com: 'SeasonChart', code: '6', kname: 'm120', ktype: 1}
      ],
      otherArr: [
        {name: '成分股', com: 'MinutesChart', code: '1'}
      ],
      comInfo: {
        com: 'MinutesChart',
        code: '1',
        kname: 'minu',
        ktype: 0,
        stockType: 1
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
    marketCode: function () {
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
        kname: choice.kname,
        ktype: choice.ktype,
        stockType: 1
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
        this.$refs[this.comInfo.kname].loadingData = false
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

  .stock-wrap {
    .info-wrap {
      height: 112px;
    }

    .chart-wrap {
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

    .el-dropdown {
      .el-dropdown-link {
        font-size: 15px;
        line-height: 28px;
        color: #ccc;
      }
    }
  }
}
</style>
<style>
.el-dropdown-menu {
  padding: 2px 0;
  background-color: #202633;
  color: ghostwhite;
  border-color: #202633;
  left: 50px;
}
</style>
