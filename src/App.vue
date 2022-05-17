<template>
  <div id="app1">
    <router-view/>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'App',
  created () {
    const that = this
    console.log('App created')
    this.$bus.$on('chilCreated', componentName => {
      console.log(`${componentName}需要开启定时任务`)
      that.setScheduledTask(componentName)
    })
  },
  mounted () {
    console.log('AppMounted')
  },
  methods: {
    moment,
    timeoutTask (currentTime, startTime, endTime, componentName) {
      const that = this
      console.log(componentName + '开始请求数据时间：' + startTime.format('YYYY-MM-DD HH:mm:ss'))
      const diffSeconds = startTime.diff(currentTime, 'seconds')
      setTimeout(() => {
        // 告知所有组件可以开始请求数据
        console.log(`通知[${componentName}]-> 开启定时任务`)
        that.$bus.$emit(`${componentName}StartRequest`)
      }, diffSeconds * 1000)
      console.log(componentName + '停止请求数据时间：' + endTime.format('YYYY-MM-DD HH:mm:ss'))
      const validSeconds = endTime.diff(currentTime, 'seconds')
      setTimeout(function () {
        // 告知所有组件可以停止请求数据
        console.log(`通知[${componentName}] -> 关闭定时任务`)
        that.$bus.$emit(`${componentName}StopRequest`)
      }, validSeconds * 1000)
    },
    setScheduledTask (componentName) {
      const that = this
      // 获取当前时间
      const currentTime = moment()
      const am0900 = moment().hours(9).minutes(30).seconds(0).milliseconds(0) // 当天9.30
      const am1130 = moment().hours(11).minutes(30).seconds(0).milliseconds(0) // 当天11.30
      const pm1300 = moment().hours(13).minutes(0).seconds(0).milliseconds(0) // 当天13.00
      const pm1500 = moment().hours(15).minutes(0).seconds(0).milliseconds(0) // 当天15.00
      // const pm1530 = moment().hours(15).minutes(30).seconds(0).milliseconds(0) // 当天15.30
      const pm2400 = moment().hours(24).minutes(0).seconds(0).milliseconds(0) // 当天24:00
      // 小于9点
      if (currentTime.isBefore(am0900)) {
        this.timeoutTask(currentTime, am0900, am1130, componentName)
        this.timeoutTask(currentTime, pm1300, pm1500, componentName)
      }
      if (currentTime.isAfter(am0900) && currentTime.isBefore(am1130)) {
        this.timeoutTask(currentTime, currentTime, am1130, componentName)
        this.timeoutTask(currentTime, pm1300, pm1500, componentName)
      }
      if (currentTime.isAfter(am1130) && currentTime.isBefore(pm1300)) {
        this.timeoutTask(currentTime, pm1300, pm1500, componentName)
      }
      if (currentTime.isAfter(pm1300) && currentTime.isBefore(pm1500)) {
        this.timeoutTask(currentTime, currentTime, pm1500, componentName)
      }
      if (currentTime.isSameOrAfter(pm1500)) {
        console.log(currentTime.format('YYYY-MM-DD HH:mm:ss'))
        console.log('第二天重新开启定时任务')
        const diffTime = pm2400.diff(currentTime, 'seconds')
        setTimeout(function () {
          that.setScheduledTask(componentName)
        }, diffTime * 1000)
      }
    }
  }
}
</script>

<style>
#app1 {
  height: 100vh;
  width: 100vw;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #101116;
  color: #adb4c2;
}
</style>
