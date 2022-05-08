<template>
  <el-container class="container">
    <el-aside :width="visibleMenu ? '64px' : '140px' " style="background-color: #161a23;" id="el-aside">
      <left-layout @routeTo="routeTo" @hideHeaderEventMenu="hideHeaderEventMenu" ref="asideMenu"/>
    </el-aside>
    <el-container>
      <el-header style="height: 52px">
        <right-header @menuVisible="menuVisible" ref="header"></right-header>
      </el-header>
      <el-main id="el-main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import LeftLayout from './LeftLayout'
import RightHeader from './RightHeader'
import VueCard from '../components/layout/VueCard'

export default {
  components: {
    LeftLayout,
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
        that.hideHeaderEventMenu()
      })
    })
  },
  methods: {
    menuVisible (visible) {
      this.$refs.asideMenu.visibleMenu = this.visibleMenu = visible
    },
    routeTo (path) {
      console.log(path)
      this.$router.push({path})
    },
    hideHeaderEventMenu () {
      this.$refs.header.choiceVisible = this.$refs.header.userMenuVisible = false
    }
  }
}
</script>
<style>
.el-header {
  padding: 10px 12px 2px 12px;
}
.el-aside {
  color: #333;
  width: unset;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
}
.el-submenu__title,.el-menu-item  {
  font-size: 18px !important;
}
.container #el-main {
  margin: 0 !important;
  padding: 0 !important;
}
.el-menu {
  border-right: 0;
}
.el-menu-item:hover {
  background-color: #000000 !important;
  color: dodgerblue !important;
}
.el-container{
  transition: 5s;
}
</style>
