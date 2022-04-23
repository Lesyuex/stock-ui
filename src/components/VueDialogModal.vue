<template>
  <el-dialog
    :visible.sync="dialogVisible"
    destroy-on-close
    width="600px"
    style="border-radius: 5px">
    <minutes-line-bar :current-stock="currentStock"></minutes-line-bar>
  </el-dialog>
</template>
<script>
import MinutesLineBar from '../view/stock/components/MinutesLineBar'
export default {
  components: {
    MinutesLineBar
  },
  props: {
    checkStock: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialogVisible: false,
      currentStock: {
        market: 'sh',
        id: '603138'
      }
    }
  },
  watch: {
    checkStock: {
      deep: true,
      handler (newVal) {
        console.log(newVal)
        this.currentStock = {id: newVal.astockCode, market: newVal.listBoardName}
      }
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    }
  }
}
</script>
<style scoped>
/deep/ ..el-dialog{
  background-color: #121420 !important;
}
/deep/ .el-dialog__header,/deep/ .el-dialog__body{
  padding: 8px;
  background-color: #121420;
}
/deep/ .el-dialog__header{
  padding: 0;
}
/deep/ .el-dialog__header{
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
/deep/ .el-dialog__body{
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
/deep/ .el-dialog__headerbtn{
  top:5px;
  right:5px;
}
</style>
