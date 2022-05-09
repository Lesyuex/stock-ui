<template>
  <div style="height: 100%;width: 100%;">
    <k-chart :market-code="marketCode" :type="type"></k-chart>
  </div>
</template>

<script>
import KChart from './KChart'

export default {
  name: 'WeekKChart',
  components: {
    KChart
  },
  props: {
    marketCode: String,
    type: String
  }
}
</script>

<style scoped>

</style>
