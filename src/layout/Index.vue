<template>
  <c-container>
    <c-aside id="aside">
      <tooltip-menu v-if="collapse" ref="asideMenu"/>
      <left-menu v-else ref="asideMenu"/>
    </c-aside>
    <c-container style="background-color: #151a22" id="content-wrap">
      <c-header>
        <right-header ref="header" @menuVisible="menuVisible" :collapse="collapse"></right-header>
      </c-header>
      <c-main id="main">
        <router-view/>
      </c-main>
    </c-container>
  </c-container>
</template>
<script>
import RightHeader from './RightHeader'
import LeftMenu from './LeftMenu'
import TooltipMenu from '../components/menu/TooltipMenu'

export default {
  name: 'Index',
  components: {
    RightHeader,
    LeftMenu,
    TooltipMenu
  },
  data () {
    return {
      collapse: false
    }
  },
  mounted () {
    const that = this
    const aside = document.getElementById('aside')
    aside.addEventListener('click', () => {
      that.hideHeaderEventMenu()
    })
    const dom = document.getElementById('main')
    dom.addEventListener('click', () => {
      that.hideHeaderEventMenu()
    })
  },
  methods: {
    menuVisible (visible) {
      this.collapse = visible
      this.$bus.$emit('resizeChart')
    },
    hideHeaderEventMenu () {
      this.$refs.header.choiceVisible = this.$refs.header.userMenuVisible = false
    }
  }
}
</script>
<style>
#content-wrap {
  min-width: 420px;
}
</style>
