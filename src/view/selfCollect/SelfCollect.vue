<template>
  <vue-card>
    <div class="my-table">
      <el-table
        size="small"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="股票"
          width="180">
        </el-table-column>
        <el-table-column
          prop="code"
          label="代码"
          width="180">
        </el-table-column>
        <el-table-column
          prop="currentPrice"
          label="最新价"
          width="180">
        </el-table-column>
        <el-table-column
          prop="upDownPercent"
          label="涨跌幅">
          <template slot-scope="scope">
            <el-button :type="scope.row.upDownPercent >= 0 ?'danger':'success'" size="mini">{{scope.row.upDownPercent + '%'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </vue-card>

</template>

<script>
import moment from 'moment'
import VueCard from '../../components/layout/VueCard'
import VueDialogModal from '../../components/dialog/MinuChartDialog'
import openTimer from '../../mixins'
export default {
  mixins: [openTimer],
  name: 'SelfCollect',
  components: {
    VueCard,
    VueDialogModal
  },
  data () {
    return {
      timer: null,
      columns: [
        {
          title: '股票',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '最新价',
          dataIndex: 'currentPrice',
          key: 'currentPrice'
        },
        {
          title: '涨跌幅',
          dataIndex: 'upDownPercent',
          key: 'upDownPercent'
        }
      ],
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  },
  created () {
    this.getDetailsData()
  },
  methods: {
    moment,
    getDetailsData () {
      const that = this
      this.$axiosGet('/stock/get/detail/sh603138,sh603881,sh603308,sh600295,sz002466,sz000158').then(res => {
        res.data.filter(data => {
          data.upDownPercent = data.upDownPercent ? data.upDownPercent.toFixed(2) : '-'
        })
        that.tableData = res.data
      }).finally(() => {
        if (this.timer) {
          window.clearTimeout(that.timer)
          that.timer = setTimeout(function () {
            that.getDetailsData()
          }, 3000)
        }
      })
    }
  }
}
</script>
<style scoped>
/deep/ .el-table__body td.el-table__cell {
    border-bottom:6px solid transparent !important;
 }
</style>
