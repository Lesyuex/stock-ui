<template>
  <el-container class="container">
    <el-aside :width="visibleMenu ? '64px' : '140px' " style="background-color: #161a23;" id="el-aside">
      <el-menu
        :collapse="visibleMenu"
        :default-openeds="['2']"
        :collapse-transition="false"
        background-color="transparent"
        text-color="#adb4c2"
        active-text-color="dodgerblue">
        <el-menu-item index="1" @click="routeTo('/china-share')">
          <i class="el-icon-s-platform"></i>
          <span slot="title">癌股</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-grid"></i>
            <span>板块</span>
          </template>
          <el-menu-item-group style="background-color: #121420">
            <el-menu-item index="2-1" style="padding:0 0 0 20px;background-color: #121420;min-width: unset">
              <template slot="title">
                <i class="el-icon-place"></i>
                <span>地域</span>
              </template>
            </el-menu-item>
            <el-menu-item index="2-2"  style="padding:0 0 0 20px;background-color: #121420;min-width: unset">
              <template slot="title">
                <i class="el-icon-office-building"></i>
                <span>行业</span>
              </template>
            </el-menu-item>
            <el-menu-item index="2-3"  style="padding:0 0 0 20px;background-color: #121420;min-width: unset">
              <template slot="title">
                <i class="el-icon-s-opportunity"></i>
                <span>概念</span>
              </template>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="3" @click="routeTo('/self-collect')">
          <i class="el-icon-star-on"></i>
          <span slot="title">自选</span>
        </el-menu-item>
        <el-menu-item index="4" @click="routeTo('/test-page')">
          <i class="el-icon-toilet-paper"></i>
          <span slot="title">测试</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <right-header @menuVisible="menuVisible" ref="choice"></right-header>
      </el-header>

      <el-main id="el-main">
        <router-view/>
      </el-main>
    </el-container>
    <img src="../assets/img.png" style="position: absolute;bottom: 20px;right: 20px;height: 60px;cursor: pointer"/>
  </el-container>

</template>
<script>
import RightHeader from './RightHeader'
import VueCard from '../components/VueCard'

export default {
  components: {
    RightHeader,
    VueCard
  },
  data () {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }
    return {
      visibleMenu: false,
      tableData: Array(20).fill(item)
    }
  },
  mounted () {
    this.$nextTick(function () {
      const that = this
      const dom = document.getElementById('el-main')
      dom.addEventListener('click', () => {
        that.hiddenChilChoiceWrap()
      })
      const menu = document.getElementById('el-aside')
      menu.addEventListener('click', () => {
        that.hiddenChilChoiceWrap()
      })
    })
  },
  methods: {
    menuVisible (visible) {
      this.visibleMenu = visible
    },
    routeTo (path) {
      console.log(path)
      this.$router.push({path})
    },
    hiddenChilChoiceWrap () {
      console.log(this.$refs.choice.choiceVisible)
      this.$refs.choice.choiceVisible = false
    }
  }
}
</script>
<style>
.el-header {
  padding: 0;
  height: 40px !important;
}
.el-aside {
  color: #333;
  width: unset;
}
.container {
  width: 100%;
  height: 100%;
}
/deep/ .el-submenu__title {
}
.container #el-main {
  padding: 0 !important;
}
.el-menu {
  border-right: 0;
}
.el-menu-item:hover {
  background-color: #000000 !important;
  color: dodgerblue !important;
}
</style>
