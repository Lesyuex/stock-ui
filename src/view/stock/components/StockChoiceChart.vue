<template>
  <div class="minutes-wrap">
    <div class="info-wrap">
      <newest-info :stock="stock" :marketCode="marketCode"/>
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
    <c-row style="height: 100%;">
      <c-col :span="comInfo.code === '1' ? 20 :24" style="height: 100%;">
        <div class="chart-wrap">
          <keep-alive>
            <component :is="comInfo.com" :stock="stock" :marketCode="marketCode" :comInfo="comInfo"
                       :ref="comInfo.kname" :refName="comInfo.kname"/>
          </keep-alive>
        </div>
      </c-col>
      <c-col :span="4" v-if="comInfo.code === '1'">
        <handicap :stock="stock" :marketCode="marketCode"/>
      </c-col>
    </c-row>

  </div>
</template>
<script>
import NewestInfo from './NewestInfo'
import Handicap from './Handicap'
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
    Handicap,
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
      comInfo: {
        com: 'MinutesChart',
        code: '1',
        kname: 'minu',
        ktype: 0,
        stockType: 0
      },
      stock: {
        stockDetail: {},
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
        stockType: 0
      }
    },
    refreshData () {
      this.getMinutesData()
    },
    getMinutesData () {
      const that = this
      this.$axiosGet(`/stock/get/minutes/1/${this.marketCode}`).then(res => {
        that.stock = res.data
      }).finally(() => {
        this.$nextTick(function () {
          this.$refs[this.comInfo.kname].loadingData = false
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
<style>
.el-dropdown-menu {
  padding: 2px 0;
  background-color: #202633;
  color: ghostwhite;
  border-color: #202633;
  left: 50px;
}
</style>
