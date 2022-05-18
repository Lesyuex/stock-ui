<template>
  <div>
    <ul class="menu">
      <li v-for="(menu,index) in menuArr" :key="index" :class="{'menu-item':!menu.children,'submenu':menu.children}" @click="routeTo(menu)">
        <i :class="menu.icon" v-if="!menu.children"></i>
        <span v-if="!menu.children">{{menu.name}}</span>

        <div class="menu-item submenu_title" v-if="menu.children">
          <i :class="menu.icon"></i>
          <span>{{menu.name}}</span>
        </div>
        <ul v-if="menu.children">
          <li v-for="(chil,index) in menu.children" :key="index" class="menu-item">
            <i :class="chil.icon"></i>
            <span>{{chil.name}}</span>
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
        {name: '自选', path: '', icon: 'el-icon-star-on'},
        {name: '测试', path: '', icon: 'el-icon-toilet-paper'}
      ]
    }
  },
  mounted () {
    this.$nextTick(function () {
      const submenuTitleList = document.getElementsByClassName('submenu_title')
      Array.from(submenuTitleList).forEach(title => {
        title.addEventListener('click', function () {
          const parentNode = title.parentNode
          const ul = parentNode.getElementsByTagName('ul')
          const display = ul[0].style.display === '' ? 'none' : ul[0].style.display
          ul[0].style.display = display === 'none' ? 'block' : 'none'
        })
      })

      const menuItemList = document.getElementsByClassName('menu-item')
      const elements = Array.from(menuItemList)
      elements.forEach((item, index) => {
        item.addEventListener('click', function () {
          if (!item.classList.contains('is-active')) {
            item.classList.add('is-active')
          }
          elements.forEach((el, elIndex) => {
            if (elIndex !== index) {
              const active = el.classList.contains('is-active')
              if (active) {
                el.classList.remove('is-active')
              }
            }
          })
        })
      })
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
  width: 140px;

  .menu-item {
    padding: 0 20px;
    line-height: 56px;
    background-color: #142033;
    color: #adb4c2;
    cursor: pointer;
    transition: .5s;

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
      transition: all 3s;

      &::after {
        content: "";
        position: absolute;
        right: 20px;
        top: 26px;
        width: 6px;
        height: 5px;
        transform: rotate(135deg);
        border-top: 1px solid white;
        border-right: 1px solid white;
      }
    }

    ul {
      display: none;

      .menu-item {
        padding-left: 30px;
        background-color: #121420;
      }
    }
  }
}
</style>
