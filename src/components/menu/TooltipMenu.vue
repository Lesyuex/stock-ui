<template>
  <div style="width: 60px;height: 100vh">
    <ul class="menu">
      <li v-for="(menu,index) in menuArr" :key="index" :class="{'menu-item':!menu.children,'submenu':menu.children}"
          @click="routeTo(menu)">
        <c-icon :name="menu.icon" :size="18" v-if="!menu.children"></c-icon>
        <span class="tool-tip" v-if="!menu.children">
        {{menu.name}}
      </span>
        <div class="menu-item submenu_title" v-if="menu.children" aria-expanded="true">
          <c-icon :name="menu.icon" :size="18"></c-icon>
        </div>
        <ul v-if="menu.children" class="menu" style="overflow:hidden">
          <li v-for="(chil,index) in menu.children" :key="index" class="menu-item">
            <c-icon :name="chil.icon" :size="18"></c-icon>
            <span>{{ chil.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import initMenu from './js/initMenu'

export default {
  name: 'LeftMenu',
  data () {
    return {
      menuArr: [
        {name: '癌股', path: '/stock-home', icon: 'stock-market'},
        {name: '资金', path: '', icon: 'funds'},
        {
          name: '板块',
          icon: 'grid-two',
          children: [
            {name: '行业', path: '', icon: 'shopping-mall'},
            {name: '概念', path: '', icon: 'tips'},
            {name: '地域', path: '', icon: 'local'}
          ]
        },
        {name: '自选', path: '/self-collect', icon: 'like'},
        {name: '测试', path: '/test-page', icon: 'experiment'}
      ]
    }
  },
  mounted () {
    this.$nextTick(function () {
      initMenu(true)
    })
  },
  methods: {
    routeTo (menu) {
      const path = this.$route.path
      if (menu.path === path) return
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
  position: absolute;
  width:60px;
  z-index: 99999;
  .menu-item {
    position: relative;
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
    .tool-tip{
      display: none;
      position: absolute;
      left: 70px;
      top: 10px;
      padding: 0 10px;
      line-height: 40px;
      font-size: 12px;
      color: #fff;
      background-color: #303133;
      border-radius: 5px;
      white-space: nowrap;
      &:before {
        content: "";
        position: absolute;
        left: -4px;
        top: 16px;
        width: 8px;
        height: 8px;
        background-color: #303133;
        transform: rotate(45deg);
      }
    }
    &:hover {
      background-color: #000000 !important;
      color: cornflowerblue;
      .tool-tip{
        display: block;
      }
    }
  }

  .is-active {
    color: cornflowerblue;
  }

  .submenu {
    position: relative;
    &:hover{
      .menu {
        display: block;
      }
    }
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
      display: none;
      position: absolute;
      left: 60px;
      top: 0;
      width: 140px;
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
