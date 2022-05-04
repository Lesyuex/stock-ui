<template>
  <v-card>
    <g-row>
      <g-col sm="24" md="12" lg="10">
        <choice-chart :marketCode="marketCode"/>
      </g-col>
    </g-row>
  </v-card>
</template>

<script>
import ChoiceChart from '../stock/components/ChoiceChart'
export default {
  name: 'Home',
  components: {
    ChoiceChart
  },
  data () {
    return {
      marketCode: 'sh603138'
    }
  }
}
</script>

<style scoped>

</style>
