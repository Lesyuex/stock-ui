<template>
  <div class="header-wrap">
    <div class="left-wrap tal">
      <i class="el-icon-s-unfold" @click="menuVisible" v-if="visibleMenu"></i>
      <i class="el-icon-s-fold" @click="menuVisible" v-else></i>
    </div>
    <div class="right-wrap">
      <div class="search-wrap">
        <i class="el-icon-search"></i>
        <input
          v-model="inputTextValue"
          type="text"
          placeholder="搜索股票/板块"
          @input="inputText"
          @blur="inputBlur"
          @focus="inputFocus"/>
        <!--小三角形-->
        <div class="nav-tip" v-if="choiceVisible"></div>
        <ul class="nav-stock-wrap" v-if="choiceVisible">
          <!--  导航栏        -->
          <li class="row-li">
            <ul class="nav-wrap">
              <li :class="{'li-active':type === 0}" @click="checkType(0)">全部</li>
              <li :class="{'li-active':type === 1}" @click="checkType(1)">股票<span></span></li>
              <li :class="{'li-active':type === 2}" @click="checkType(2)">板块<span></span></li>
            </ul>
          </li>
          <!-- 股票选择  -->
          <li class="row-li">
            <ul class="stock-wrap">
              <li v-for="(stock, index) in showList" :key="index">
                <div class="info-wrap tal" @click="showMinutesModal(stock)">
                  <span style="width: 100%;font-size: 14px;line-height: 20px">
                    {{ stock.secNameCn }}
                    <img src="../assets/nation/china.png" style="height: 11px;vertical-align: middle;margin-left: 6px">
                  </span>
                  <span style="display:block;font-size: 14px;margin-top: 4px">
                    {{ stock.marketCode }}
                  </span>
                </div>
                <div class="collect-wrap tar">
                  <span class="collect-btn" @click="collectStock(stock)">加自选</span>
                </div>
              </li>
              <li v-if="filterList.length > 10 && this.showList.length <= 10" class="tac">
                <span @click="showList = filterList" style="cursor: pointer;font-size: 14px;">查看更多股票></span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="img-wrap">
        <img src="../assets/head.gif" @click="showUserMenu">
        <i class="el-icon-caret-bottom" @click="showUserMenu"></i>
        <div class="nav-tip" v-if="userMenuVisible"></div>
        <ul v-if="userMenuVisible">
          <li>我的自选</li>
          <li>退出登录</li>
        </ul>
      </div>
    </div>
    <vue-dialog-modal ref="modal" :marketCode="marketCode" @closeDialog="closeDialog"></vue-dialog-modal>
  </div>
</template>
<script>
import VueCard from '../components/VueCard'
import VueDialogModal from '../components/MinuChartDialog'
import PinyinMatch from 'pinyin-match'

export default {
  name: 'RightHeader',
  components: {
    VueCard,
    VueDialogModal
  },
  data () {
    return {
      userMenuVisible: false,
      dialogVisible: false,
      marketCode: 'sh000001',
      choiceVisible: false,
      inputTextValue: undefined,
      visibleMenu: false,
      stockList: [],
      filterList: [],
      showList: [],
      type: 0
    }
  },
  created () {
    this.$axiosGet('/stock/list/all').then(res => {
      this.stockList = res.data
    })
  },
  methods: {
    showUserMenu () {
      this.userMenuVisible = !this.userMenuVisible
      if (this.userMenuVisible) this.choiceVisible = false
    },
    inputBlur () {
    },
    inputFocus (e) {
      this.choiceVisible = true
      this.userMenuVisible = false
    },
    closeDialog () {
      this.dialogVisible = false
    },
    checkType (type) {
      this.type = type
    },
    collectStock (stock) {
      this.$message.success('恭喜你，请登录')
    },
    showMinutesModal (stock) {
      this.marketCode = stock.marketCode
      this.$refs.modal.dialogVisible = true
    },
    menuVisible () {
      this.visibleMenu = !this.visibleMenu
      this.$emit('menuVisible', this.visibleMenu)
    },
    inputText () {
      const value = this.inputTextValue
      const arr = []
      if (!value || value === '') return
      for (let i = 0; i < this.stockList.length; i++) {
        const stock = this.stockList[i]
        if (stock.marketCode.indexOf(value) > -1 || stock.secNameCn.indexOf(value) > -1 || PinyinMatch.match(stock.secNameCn, value)) {
          arr.push(stock)
        }
      }
      this.filterList = arr
      this.showList = arr.length > 10 ? arr.slice(0, 10) : arr
    }
  }
}
</script>

<style scoped lang="less">

.header-wrap {
  height: 40px;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: #161a23;
  /*清楚浮动导致父元素高度为0*/
  &::before, &::after {
    display: block;
    content: '';
    clear: both;
  }

  .left-wrap, .right-wrap {
    position: relative;
    height: 100%;
  }

  .left-wrap {
    float: left;

    i {
      padding: 0 12px;
      font-size: 26px;
      line-height: 40px;
      cursor: pointer;
    }
  }

  .right-wrap {
    float: right;

    .search-wrap {
      position: relative;
      float: left;
      width: 363px;

      i {
        position: absolute;
        left: 5px;
        top: 12px;
        font-size: 16px;
        cursor: pointer;
        z-index: 999;
      }

      input {
        position: relative;
        top: 4px;
        width: 338px;
        height: 32px;
        padding-left: 25px;
        color: #adb4c2;
        font-size: 16px;
        background-color: rgba(0, 0, 0, 0.5);
        outline: none;
        border: none;
        border-radius: 5px;
        transition: 0.5s;

        &:focus {
          color: black;
          background-color: #c9c7c7;
        }
      }

      .nav-tip {
        position: absolute;
        left: 5px;
        border: 10px solid rgba(0, 0, 0, 0);
        border-bottom-color: #161a23;
        transition: 0.5s;
        z-index: 999;
      }

      .nav-stock-wrap {
        position: absolute;
        top: 50px;
        width: 100%;
        background-color: #161a23;
        border-radius: 5px;
        transition: 0.5s;
        z-index: 999;

        li {
          list-style: none;
        }

        .row-li {
          width: 100%;

          .nav-wrap {
            li {
              position: relative;
              float: left;
              padding-left: 8px;
              font-size: 14px;
              line-height: 40px;
              cursor: pointer;
            }

            .li-active::after {
              content: '';
              display: block;
              position: absolute;
              bottom: 6px;
              left: 12px;
              width: 18px;
              height: 2px;
              background-color: skyblue;
            }
          }

          .stock-wrap {
            width: 100%;
            max-height: calc(100vh - 180px);
            box-sizing: border-box;
            overflow: auto;

            li {
              float: left;
              width: 100%;
              //height: 38px;
              padding: 4px 8px;
              border-top: 1px solid #24272f;
              box-sizing: border-box;
              cursor: pointer;

              &::before, &::after {
                content: '';
                display: block;
                clear: both;
              }

              div {
                float: left;
                width: 50%;
              }

              .info-wrap, .collect-wrap {
                height: 38px;
              }

              .collect-wrap {
                line-height: 38px;

                .collect-btn {
                  color: #c7c6c6;
                  padding: 3px 6px;
                  font-size: 14px;
                  border-radius: 6px;
                  background-color: royalblue;
                  cursor: pointer;
                }
              }
            }

            &::-webkit-scrollbar {
              width: 2px;
            }

            &::-webkit-scrollbar-thumb {
              background-color: #a17f7f;
            }

            &::-webkit-scrollbar-track {
              background-color: black;
            }
          }
        }
      }
    }

    .img-wrap {
      float: right;
      position: relative;
      height: 26px;
      margin: 7px 16px;
      border-radius: 5px;

      img {
        height: 100%;
        cursor: pointer;
        border-radius: 5px;
      }

      i {
        cursor: pointer;
        position: absolute;
        right: -12px;
        bottom: -2px;
        font-size: 12px;
      }

      .nav-tip {
        position: absolute;
        left: 5px;
        top: 22px;
        border: 8px solid transparent;
        border-bottom-color: whitesmoke;
        transition: 0.5s;
        z-index: 2;
      }

      ul {
        position: absolute;
        left: -18px;
        top: 36px;
        width: 64px;
        height: 56px;
        background-color: whitesmoke;
        border-radius: 5px;
        box-shadow: whitesmoke 0 0 3px 0;
        transition: .5s;
        z-index: 999;

        li {
          list-style: none;
          line-height: 16px;
          padding: 4px 4px;
          font-size: 12px;
          color: #606266;
          cursor: pointer;

          &:nth-child(1) {
            padding-top: 8px;
          }

          &:nth-child(2) {
            padding-bottom: 8px;
          }
        }
      }
    }
  }

}
</style>
