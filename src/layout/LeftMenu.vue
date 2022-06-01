<template>
  <div style="width:140px;height: 100%" id="aside">
    <ul class="menu">
      <li
        v-for="(menu,index) in menuArr"
        :key="index"
        :class="{'menu-item':!menu.children,'submenu':menu.children,'is-active':menuCheck.indexOf(menu.name)>-1}"
        @click="routeTo(menu,null)">
        <c-icon
          :name="menu.icon"
          :size="18"
          v-if="!menu.children"
          :fill="menuCheck.indexOf(menu.name)>-1 ? 'cornflowerblue':defaultFill"></c-icon>
        <span v-if="!menu.children">{{ menu.name }}</span>
        <div class="menu-item submenu_title" v-if="menu.children" aria-expanded="true">
          <c-icon :name="menu.icon" :size="18"></c-icon>
          <span>{{ menu.name }}</span>
          <c-icon name="up-one" :size="14" class="tip" theme="filled"></c-icon>
        </div>
        <ul v-if="menu.children" class="menu" style="overflow:hidden">
          <li v-for="(chil,index) in menu.children" :key="index" :class="{'menu-item':true}"
              @click.stop="routeTo(menu,chil)">
            <c-icon :name="chil.icon" :size="18"
                    :fill="menuCheck.indexOf(chil.name)>-1? 'cornflowerblue':defaultFill"></c-icon>
            <span>{{ chil.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
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
      menuCheck: '癌股',
      defaultFill: '#ccc',
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
      initMenu()
    })
  },
  computed: {},
  methods: {
    routeTo (menu, chil) {
      this.menuCheck = menu.name
      if (chil) this.menuCheck += `-${chil.name}`
      console.log(this.menuCheck)
      const path = this.$route.path
      if (menu.path === path) return
      if (menu.path) this.$router.push({path: menu.path})
    }
  }
}
</script>

<style scoped lang="less">
#aside {
  .menu {
    .icon {
      width: 25px;
      height: 25px;
      margin-right: 6px;
      color: white;
    }

    font-size: 18px;

    .menu-item {
      padding: 0 20px;
      line-height: 56px;
      cursor: pointer;
      transition: .2s;

      .i-icon {
        text-align: center;
        margin-right: 8px;
      }

      &:hover {
        background-color: #000000 !important;
        color: cornflowerblue;
      }
    }

    .is-active {
      > span {
        color: cornflowerblue !important;
      }
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
          background-color: #1a1d2b;
        }
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
