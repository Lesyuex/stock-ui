<template>
  <div class="minutes-wrap">
    <div class="info-wrap">
      <newest-info :stock="stock"/>
    </div>
    <div class="nav-wrap">
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
        <component
          :is="comInfo.com"
          :stock="stock"
          :marketCode="marketCode"
          :comInfo="comInfo"
          :ref="comInfo.kname"
          :refName="comInfo.kname"/>
      </keep-alive>
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
    },
    name: {
      type: String,
      default: 'bookmark-one'
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
      comInfo: localStorage.getItem('preChoice') ? JSON.parse(localStorage.getItem('preChoice')) : {
        com: 'MinutesChart',
        code: '1',
        kname: 'minu',
        ktype: 0,
        stockType: 1
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
        stockType: 1
      }
      localStorage.setItem('preChoice', JSON.stringify(this.comInfo))
    },
    refreshData () {
      this.getMinutesData()
    },
    getMinutesData () {
      const that = this
      this.$axiosGet(`/stock/get/minutes/2/${this.marketCode}`).then(res => {
        that.stock = Object.assign({marketCode: this.marketCode}, res.data)
      }).finally(() => {
        // this.$refs[this.comInfo.kname].loadingData = false
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
.minutes-wrap {
  height: 486px;
  background-color: #1a2029;
  border-radius: 5px;
  box-shadow: 0 0 5px #181818;

  &:before, &:after {
    content: '';
    display: block;
    clear: both;
  }

  > div {
    float: left;
    width: 100%;
    box-sizing: border-box;
  }

  .info-wrap {
    height: 130px;
  }

  .nav-wrap {
    height: 40px;
    padding: 0 8px;

    ul {
      height: 40px;

      li {
        float: left;
        position: relative;
        list-style: none;
        padding: 0 20px 0 0;
        line-height: 40px;
        cursor: pointer;
        font-size: 15px;
      }

      .li-active {
        color: lightskyblue;

        &::after {
          content: '';
          position: absolute;
          left: calc(50% - 16px);
          bottom: 7px;
          width: 12px;
          height: 2px;
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

  .chart-wrap {
    padding: 0 8px;
    height: 300px;
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
