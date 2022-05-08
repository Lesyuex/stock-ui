<template>
  <el-dialog
    :visible.sync="dialogVisible"
    destroy-on-close
    width="60%"
    height="500px"
    :modal-append-to-body="true"
    :append-to-body="true"
    style="border-radius: 5px">
    <choice-chart :market-code="marketCode" v-if="dialogVisible"/>
  </el-dialog>
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
/deep/ .el-dialog{
  background-color: #161a23 !important;
}
/deep/ .el-dialog__header,/deep/ .el-dialog__body{
  padding: 8px;
  background-color:  #161a23;
}
/deep/ .el-dialog__header{
  padding: 0;
}
/deep/ .el-dialog__header{
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
/deep/ .el-dialog__body{
  height: 500px;
  min-width: 625px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
/deep/ .el-dialog__headerbtn{
  top:5px;
  right:5px;
}
</style>
