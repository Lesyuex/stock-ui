<template>
  <div>
    <el-menu
      :collapse="visibleMenu"
      :default-openeds="['3']"
      :collapse-transition="false"
      background-color="transparent"
      text-color="#adb4c2"
      active-text-color="dodgerblue">
      <el-menu-item index="1" @click="routeTo('/stock-home')">
        <i class="el-icon-s-platform"></i>
        <span slot="title">癌股</span>
      </el-menu-item>
      <el-menu-item index="2" @click="routeTo('/china-share')">
        <i class="el-icon-coin"></i>
        <span slot="title">资金</span>
      </el-menu-item>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-s-grid"></i>
          <span>板块</span>
        </template>
        <el-menu-item-group style="background-color: #121420">
          <el-menu-item index="3-1" style="padding:0 0 0 20px;background-color: #121420;min-width: unset">
            <template slot="title">
              <i class="el-icon-place"></i>
              <span>地域</span>
            </template>
          </el-menu-item>
          <el-menu-item index="3-2"  style="padding:0 0 0 20px;background-color: #121420;min-width: unset">
            <template slot="title">
              <i class="el-icon-office-building"></i>
              <span>行业</span>
            </template>
          </el-menu-item>
          <el-menu-item index="3-3"  style="padding:0 0 0 20px;background-color: #121420;min-width: unset">
            <template slot="title">
              <i class="el-icon-s-opportunity"></i>
              <span>概念</span>
            </template>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="4" @click="routeTo('/self-collect')">
        <i class="el-icon-star-on"></i>
        <span slot="title">自选</span>
      </el-menu-item>
      <el-menu-item index="5" @click="routeTo('/test-page')">
        <i class="el-icon-toilet-paper"></i>
        <span slot="title">测试</span>
      </el-menu-item>
    </el-menu>
    <img src="../assets/img.png" style="position: absolute;bottom: 20px;left: calc(50% - 25px);height: 60px;cursor: pointer"/>
  </div>
</template>

<script>
export default {
  name: 'LeftLayout',
  data () {
    return {
      visibleMenu: false
    }
  },
  mounted () {
    const menu = document.getElementById('el-aside')
    menu.addEventListener('click', () => {
      this.$emit('hideHeaderEventMenu')
    })
  },
  methods: {
    routeTo (path) {
      this.$emit('routeTo', path)
    }
  }
}
</script>

<style scoped>

</style>
