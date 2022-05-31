<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'App',
  data () {
    return {
      marketTime: {
        am0900: moment().hours(9).minutes(30).seconds(0).milliseconds(0), // 当天9.30
        am1130: moment().hours(11).minutes(30).seconds(0).milliseconds(0), // 当天11.30
        pm1300: moment().hours(13).minutes(0).seconds(0).milliseconds(0), // 当天13.00
        pm1500: moment().hours(15).minutes(0).seconds(0).milliseconds(0), // 当天15.00
        pm2400: moment().hours(24).minutes(0).seconds(0).milliseconds(0) // 当天24:00
      }
    }
  },
  mounted () {
    const that = this
    // 监听需要开启定时任务的子组件的timerCreated事件
    this.$bus.$on('timerCreated', componentKey => {
      that.setScheduledTask(componentKey)
    })
  },
  methods: {
    moment,
    timeoutTask (currentTime, startTime, endTime, componentKey) {
      const that = this
      const diffSeconds = startTime.diff(currentTime, 'seconds')
      setTimeout(() => {
        // 告知所有组件可以开始请求数据
        that.$bus.$emit(`${componentKey}StartRequest`)
      }, diffSeconds * 1000)
      const validSeconds = endTime.diff(currentTime, 'seconds')
      setTimeout(function () {
        // 告知所有组件可以停止请求数据
        that.$bus.$emit(`${componentKey}StopRequest`)
      }, validSeconds * 1000)
    },
    setScheduledTask (componentKey) {
      const that = this
      // 获取当前时间
      const currentTime = moment()
      const marketTime = this.marketTime
      // 小于9点
      if (currentTime.isBefore(marketTime.am0900)) {
        this.timeoutTask(currentTime, marketTime.am0900, marketTime.am1130, componentKey)
        this.timeoutTask(currentTime, marketTime.pm1300, marketTime.pm1500, componentKey)
      }
      if (currentTime.isAfter(marketTime.am0900) && currentTime.isBefore(marketTime.am1130)) {
        this.timeoutTask(currentTime, currentTime, marketTime.am1130, componentKey)
        this.timeoutTask(currentTime, marketTime.pm1300, marketTime.pm1500, componentKey)
      }
      if (currentTime.isAfter(marketTime.am1130) && currentTime.isBefore(marketTime.pm1300)) {
        this.timeoutTask(currentTime, marketTime.pm1300, marketTime.pm1500, componentKey)
      }
      if (currentTime.isAfter(marketTime.pm1300) && currentTime.isBefore(marketTime.pm1500)) {
        this.timeoutTask(currentTime, currentTime, marketTime.pm1500, componentKey)
      }
      if (currentTime.isSameOrAfter(marketTime.pm1500)) {
        const diffTime = marketTime.pm2400.diff(currentTime, 'seconds')
        setTimeout(function () {
          that.setScheduledTask(componentKey)
        }, diffTime * 1000)
      }
    }
  }
}
</script>

<style>

</style>
