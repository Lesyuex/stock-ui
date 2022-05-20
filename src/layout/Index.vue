<template>
  <gz-container>
    <gz-aside id="aside">
      <tooltip-menu v-if="collapse" ref="asideMenu"/>
      <left-menu v-else ref="asideMenu"/>
    </gz-aside>
    <gz-container style="background-color: #142033" class="content-wrap">
      <gz-header>
        <right-header ref="header" @menuVisible="menuVisible" :collapse="collapse"></right-header>
      </gz-header>
      <gz-main id="main">
        <router-view/>
      </gz-main>
    </gz-container>
  </gz-container>
<!--<section id="container">
  <left-container ref="asideMenu"></left-container>
  <right-container>
      <right-header v-slot:header ref="header" @menuVisible="menuVisible"></right-header>
  </right-container>
</section>-->
</template>

<script>
import RightContainer from './RightContainer'
import RightHeader from './RightHeader'
import LeftMenu from './LeftMenu'
import TooltipMenu from '../components/menu/TooltipMenu'
import GzContainer from './GzContainer'
import GzAside from './GzAside'
import GzMain from './GzMain'
import GzHeader from './GzHeader'
export default {
  name: 'Index',
  components: {
    GzContainer,
    GzAside,
    GzMain,
    GzHeader,
    RightContainer,
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
    },
    hideHeaderEventMenu () {
      this.$refs.header.choiceVisible = this.$refs.header.userMenuVisible = false
    }
  }
}
</script>
