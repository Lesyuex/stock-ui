<template>
  <div class="header-wrap">
    <div class="text-align-left left-wrap">
      <i class="el-icon-s-unfold header-icon" @click="menuVisible()" v-if="visibleMenu"></i>
      <i class="el-icon-s-fold header-icon" @click="menuVisible()" v-else></i>
    </div>
    <div class="input-wrap">
      <i class="el-icon-search"></i>
      <input
        type="text"
        placeholder="搜索股票/板块"
        @input="inputText"
        v-model="inputTextValue"
        @focus="choiceVisible = true"/>
      <div class="nav-tip" id="nav-tip" v-if="choiceVisible"></div>
      <div class="choice-wrap" id="choice-wrap" v-if="choiceVisible">
        <ul class="title-nav">
          <li>股票</li>
          <li>板块</li>
        </ul>
        <ul class="result-nav">
          <li v-for="(item, index) in showList" :key="index">
            <div class="text-align-left info-wrap" @click="showMinutesModal(item)">
              {{ item.secNameCn }} <span class="belong-span">cn</span>
              <p style="font-size: 12px;padding-top: 4px">{{ `${item.listBoardName} ${item.astockCode}` }}</p>
            </div>
            <div class="collect-wrap text-align-right">
              <span class="collect-btn">加自选</span>
            </div>
          </li>
          <li v-if="filterList.length > 10 && this.showList.length <= 10">
            <span @click="showList = filterList" style="cursor: pointer">查看更多股票></span>
          </li>
        </ul>
      </div>
    </div>
    <div class="right-wrap">
      <img src="../assets/head.gif">
    </div>
    <vue-dialog-modal ref="modal" :checkStock="checkStock" v-if="dialogVisible" @closeDialog="closeDialog"></vue-dialog-modal>
  </div>
</template>

<script>
import VueCard from '../components/VueCard'
import VueDialogModal from '../components/VueDialogModal'

export default {
  name: 'RightHeader',
  components: {
    VueCard,
    VueDialogModal
  },
  data () {
    return {
      dialogVisible: false,
      checkStock: {},
      choiceVisible: false,
      inputTextValue: undefined,
      visibleMenu: false,
      stockList: [],
      filterList: [],
      showList: []
    }
  },
  created () {
    this.$axiosGet('/stock/list/all').then(res => {
      this.stockList = res.data
    })
  },
  methods: {
    closeDialog () {
      this.dialogVisible = false
    },
    showMinutesModal (stock) {
      console.log(stock)
      this.checkStock = {
        id: stock.astockCode,
        market: 'cn-stock'
      }
      this.dialogVisible = true
      this.choiceVisible = !this.choiceVisible
    },
    menuVisible () {
      this.visibleMenu = !this.visibleMenu
      this.$emit('menuVisible', this.visibleMenu)
    },
    inputText () {
      const value = this.inputTextValue
      const arr = []
      for (let i = 0; i < this.stockList.length; i++) {
        const stock = this.stockList[i]
        let listBoardName = 'sz'
        if (stock.listBoard === '1') {
          listBoardName = 'sh'
        }
        stock.listBoardName = listBoardName
        if (stock.astockCode.indexOf(value) > -1 || stock.bstockCode.indexOf(value) > -1 || stock.secNameCn.indexOf(value) > -1) {
          arr.push(stock)
        }
      }
      this.filterList = arr
      if (arr.length > 10) {
        this.showList = arr.slice(0, 10)
      } else {
        this.showList = this.filterList
      }
    }
  }
}
</script>

<style scoped>

.header-wrap {
  height: 40px;
  margin: 8px 16px;
  border-radius: 4px;
  background-color: #161a23;
}
/*清楚浮动导致父元素高度为0*/
.header-wrap::before, .header-wrap::after {
  display: block;
  content: '';
  clear: both;
}

@media screen and (max-width: 1408px) {
  .header-wrap {

  }
}

@media screen and (min-width: 1408px) {
  .header-wrap {

  }
}

.header-wrap .left-wrap, .input-wrap {
  position: relative;
  float: left;
  height: 100%;
}

/*
.left-wrap::before, .left-wrap::after {
  content: '';
  display: block;
  clear: both;
}
*/

.left-wrap .header-icon {
  display: inline-block;
  padding: 0 12px;
  height: 100%;
  margin-top: 7px;
  font-size: 26px;
  cursor: pointer;
  vertical-align: middle;
}

.left-wrap .el-icon-search {
  font-size: 12px;
}

.input-wrap .el-icon-search {
  position: relative;
  left: 10px;
  font-size: 12px;
  margin-top: 14px;
  cursor: pointer;
  z-index: 999;
}

.input-wrap input {
  position: relative;
  left: -10px;
  width: 338px;
  height: 26px;
  padding-left: 20px;
  color: #adb4c2;
  background-color: rgba(0, 0, 0, 0.5);
  outline: none;
  border: none;
  border-radius: 5px;
  transition: 0.5s;
}

.input-wrap input:focus {
  color: black;
  background-color: #c9c7c7;
  transition: 0.5s;
}

.input-wrap .nav-tip {
/ / display: none;
  position: absolute;
  left: 5px;
  width: 0;
  font-size: 14px;
  font-weight: 600;
  border: 10px solid rgba(0, 0, 0, 0);
  border-bottom-color: rgba(0,0,0,.94);
  transition: 0.5s;
}

.input-wrap .choice-wrap {
/ / display: none;
  position: absolute;
  top: 50px;
  width: 364px;
  font-size: 14px;
  font-weight: 500;
  color: #c7c6c6;
  background-color: rgba(0,0,0,.94);
  border-radius: 5px;
  z-index: 999;
  transition: 0.5s;
}

.choice-wrap .title-nav {
  height: 36px;
}

.title-nav li {
  float: left;
  padding-left: 12px;
  line-height: 36px;
  list-style: none;
}

.choice-wrap .result-nav {
  width: 100%;
  max-height: calc(100vh - 180px);
  overflow: auto;
}

.result-nav::-webkit-scrollbar{
  width: 7px;
}
.result-nav::-webkit-scrollbar-thumb{
  background-color: red;
}
.result-nav::-webkit-scrollbar-track{
  background-color:black;
}
.result-nav li {
  padding: 6px 12px;
  list-style: none;
  border-top: 1px solid #171717;
}

.result-nav li::before, li::after {
  content: '';
  display: block;
  clear: both;
}

.result-nav li .info-wrap {
  float: left;
  width: 280px;
  height: 38px;
  cursor: pointer;
}
.result-nav li .collect-wrap {
  float: left;
  width: 50px;
  height: 38px;
  line-height: 38px;
}
.belong-span{
  padding: 1px;
  background-color: #ee4957;
  font-size: 12px;
  border-radius: 2px;
  color:black
}
.collect-btn{
  color: #c7c6c6;
  padding:3px 6px;
  font-size: 12px;
  border-radius: 6px;
  background-color: royalblue;
  cursor: pointer;
}
.header-wrap .right-wrap {
  float: right;
  height: 100%;
}

.right-wrap img {
  height: 26px;
  margin: 7px 12px;
  border-radius: 5px;
}

</style>
