<template>
  <Modal
    v-model="dialogVisible"
    width="900px"
    footer-hide
    draggable>
      <div slot="header"></div>
    <choice-chart :market-code="marketCode" v-if="dialogVisible"/>
  </Modal>
</template>
<script>
import ChoiceChart from '../../view/stock/components/StockChoiceChart'
export default {
  components: {
    ChoiceChart
  },
  props: {
    marketCode: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  }
}
</script>
<style scoped>
/deep/ .ivu-modal-content{
  background-color:   #1a2029;
}
/deep/ .ivu-modal-header{
  border-bottom-color: transparent;
}
/deep/ .ivu-modal-body{
  padding: 0 8px;
}
/deep/ .ivu-modal-header{
 padding: 8px 8px 12px 8px;
}
</style>
