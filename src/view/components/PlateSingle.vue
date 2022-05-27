<template>
  <div class="plate-wrap">
    <h3 class="title-wrap">领涨板块</h3>
    <div class="increase-wrap">
      <div
        class="plate-box"
        :key="i"
        v-for="(item,i) in leadUpList">
        <div class="tac plate">{{ item.name }}</div>
        <div class="tac plate-percent" :style="getTextStyle(item.percent)">{{ item.percent.toFixed(2) }}%</div>
        <div class="tac stock">
          {{ item.leadUpName }}
        </div>
        <div class="tac" :style="getTextStyle(item.leadUpPercent)">
          {{ item.leadUpPrice | toFixedTwo}}
          &nbsp;
          {{ item.leadUpPercent | toFixedTwo }}%
        </div>
      </div>
    </div>
    <h3 class="title-wrap">领跌板块</h3>
    <div class="unincrease-wrap">
      <div
        class="plate-box"
        :key="i"
        v-for="(item,i) in leadDownList">
        <div class="tac plate">{{ item.name }}</div>
        <div class="tac plate-percent" :style="getTextStyle(item.percent)">{{ item.percent.toFixed(2) }}%</div>
        <div class="tac stock">
          {{ item.leadDownName }}
        </div>
        <div class="tac" :style="getTextStyle(item.leadDownPercent)">
          {{ item.leadDownPrice | toFixedTwo}}
          &nbsp;
          {{ item.leadDownPercent | toFixedTwo }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import openTimer from '../../mixins'

export default {
  name: 'PlateSingle',
  mixins: [openTimer],
  data () {
    return {
      leadUpList: [],
      leadDownList: []
    }
  },
  created () {
    this.refreshData()
  },
  methods: {
    getTextStyle (percent) {
      const style = {
        color: '#ee4957'
      }
      if (percent < 0) style.color = '#01d078'
      return style
    },
    refreshData () {
      this.$axiosGet('/plate/get/leadUpAndDown/2').then(res => {
        console.log(res)
        this.leadDownList = res.data.leadDownList
        this.leadUpList = res.data.leadUpList
      })
    }
  }
}
</script>

<style scoped lang="less">
.plate-wrap {
  height: 486px;
  padding: 8px;
  box-sizing: border-box;
  background-color: #1a2029;
  border-radius: 5px;

  .title-wrap {
    font-size: 18px;
    line-height: 30px;
  }

  .increase-wrap, .unincrease-wrap {
    height: 205px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-content: space-between;
    flex-wrap: wrap;
    overflow: hidden;

    .plate-box {
      width: calc((100% - 16px) / 3);
      height: 98.5px;
      float: left;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      background-color: rgba(0,0,0,.1);

      &:nth-child(2), &:nth-child(5) {
        margin-left: 8px;
        margin-right: 8px;
      }

      .plate {
        font-size: 16px;
        color: #dfdfe5;
      }
      .plate-percent{
        font-size: 18px;
      }
      .stock{
        color: #ccc;
      }
    }
  }
}
</style>
