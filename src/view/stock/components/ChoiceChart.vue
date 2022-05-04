<template>
  <div class="minutes-wrap">
    <newest-info :newestInfo="stockData.newestInfo" :marketCode="marketCode"/>
    <div class="choice-wrap">
      <ul>
        <li
          :key="choice.name"
          :class="{'li-active':choice.code === comInfo.code}"
          @click="choiceCom(choice)"
          v-for="choice in choiceArr">
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
</template>
<script>
import NewestInfo from './NewestInfo'
import Handicap from './Handicap'
import MinutesChart from './MinutesChart'

export default {
  mixins: [],
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
      this.$axiosGet(`/stock/get/minutes/${this.marketCode}`).then(res => {
        that.stockData = res.data
      }).finally(() => {
        if (this.timer) {
          setTimeout(function () {
            that.refreshData()
          }, 3333)
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
  height: 402px;
  margin: 8px 4px;
}

.minutes-wrap:before, .minutes-wrap:after {
  content: '';
  display: block;
  clear: both;
}

.minutes-wrap > div {
  float: left;
  width: 100%;
}

.choice-wrap {
  ul {
    height: 28px;

    li {
      float: left;
      position: relative;
      list-style: none;
      padding: 8px 12px;
      line-height: 28px;
      cursor: pointer;
    }
      .li-active{
        color: lightskyblue;
        &::after {
          content: '';
          display: block;
          position: absolute;
          left: 22px;
          width: 10px;
          bottom: 6px;
          height: 2px;
          background-color: skyblue;
        }
      }
  }
}

.chart-wrap {
  width: 100%;
  height: calc(100% - 130px);
}

</style>
