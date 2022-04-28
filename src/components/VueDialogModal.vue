<template>
  <el-dialog
    :visible.sync="dialogVisible"
    destroy-on-close
    width="60%"
    height="500px"
    :modal-append-to-body="true"
    :append-to-body="true"
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
      dialogVisible: true,
      currentStock: {
        market: 'cn-stock',
        id: '603138'
      }
    }
  },
  watch: {
    checkStock: {
      deep: true,
      handler (newVal) {
        console.log(newVal)
        this.currentStock = {id: this.checkStock.id, market: this.checkStock.market}
      }
    }
  },
  created(){
    this.currentStock = {id: this.checkStock.id, market: this.checkStock.market}
  },
  methods: {
    handleClose (done) {
      this.$emit('closeDialog')
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
