<template>
  <vue-card>

    <span style="background-color: #e45f47;font-size: 200px;font-weight: 800;color: white">涨</span>
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
export default {
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
    console.log(this.$options.name + ' created')
  },
  mounted () {
    this.$bus.$emit('mounted', 'selfCollect')
    const that = this
    this.$bus.$on('selfCollectStartRequest', () => {
      console.log(this.$options.name + ' -> startRequest')
      that.startRequestInterval()
    })
    this.$bus.$on('selfCollectStopRequest', () => {
      console.log(this.$options.name + ' -> stopRequest')
      that.stopRequestInterval()
    })
    console.log(that.$options.name + ' mounted')
  },

  beforeDestroy () {
    this.$bus.$off('startRequestData')
    this.$bus.$off('stopRequestData')
  },
  methods: {
    moment,
    getDetailsData () {
      const that = this
      this.$axiosGet('/getShareDetailInfo?id=sh603138').then(res => {
        that.tableData = [res.data, res.data]
      })
    },
    startRequestInterval () {
      const that = this
      that.timer = setInterval(function () {
        setTimeout(function () {
          that.getDetailsData()
        }, 0)
      }, 2000)
    },
    stopRequestInterval () {
      const that = this
      window.clearInterval(that.timer)
    }
  }
}
</script>
<style scoped>
/deep/ .el-table__body td.el-table__cell {
    border-bottom:6px solid transparent !important;
 }
</style>
