<template>
  <div style="width:140px">
    <ul class="menu">
      <li v-for="(menu,index) in menuArr" :key="index" :class="{'menu-item':!menu.children,'submenu':menu.children}"
          @click="routeTo(menu)">
        <i :class="menu.icon" v-if="!menu.children"></i>
        <span v-if="!menu.children">{{ menu.name }}</span>
        <div class="menu-item submenu_title" v-if="menu.children" aria-expanded="true">
          <i :class="menu.icon"></i>
          <span>{{ menu.name }}</span>
          <i class="el-icon-arrow-up tip"></i>
        </div>
        <ul v-if="menu.children" class="menu" style="overflow:hidden">
          <li v-for="(chil,index) in menu.children" :key="index" class="menu-item">
            <i :class="chil.icon"></i>
            <span>{{ chil.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <submenu>
      <template slot="title">
        <i class="el-icon-s-grid"></i>
        <span>板块</span>
      </template>
    </submenu>
    <sub-menu2>
      <template>
        板块
      </template>
    </sub-menu2>
  </div>
</template>

<script>
import Submenu from '../components/menu/Submenu'
import SubMenu2 from '../components/menu/SubMenu2'
import initMenu from '../components/menu/js/initMenu'
export default {
  name: 'LeftMenu',
  components: {
    Submenu,
    SubMenu2
  },
  data () {
    return {
      menuArr: [
        {name: '癌股', path: '/stock-home', icon: 'el-icon-s-platform'},
        {name: '资金', path: '', icon: 'el-icon-coin'},
        {
          name: '板块',
          icon: 'el-icon-s-grid',
          children: [
            {name: '行业', path: '', icon: 'el-icon-office-building'},
            {name: '概念', path: '', icon: 'el-icon-s-opportunity'},
            {name: '地域', path: '', icon: 'el-icon-place'}
          ]
        },
        {name: '自选', path: '/self-collect', icon: 'el-icon-star-on'},
        {name: '测试', path: '', icon: 'el-icon-toilet-paper'}
      ]
    }
  },
  mounted () {
    this.$nextTick(function () {
      initMenu()
    })
  },
  methods: {
    routeTo (menu) {
      if (menu.path) this.$router.push({path: menu.path})
    }
  }
}
</script>

<style scoped lang="less">
ul {

  list-style: none;
  font-size: 18px;
}

.menu {
  background-color: #142033;

  .menu-item {
    padding: 0 20px;
    line-height: 56px;
    color: #adb4c2;
    cursor: pointer;
    transition: .3s;
    i {
      width: 24px;
      text-align: center;
      margin-right: 6px;
    }

    &:hover {
      background-color: #000000 !important;
      color: cornflowerblue;
    }
  }

  .is-active {
    color: cornflowerblue;
  }

  .submenu {

    > .menu-item {
      position: relative;

      .tip {
        position: absolute;
        top: 20px;
        right: 6px;
        font-size: 6px;
        transition: .5s;
      }
    }

    .menu {
      .menu-item {
        padding-left: 30px;
        background-color: #121420;
      }
    }
  }
}
@keyframes none {
  from {
  }
  to {
    display: none;
  }
}
</style>
