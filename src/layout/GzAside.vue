<template>
  <aside class="gz-aside">
    <slot/>
  </aside>
</template>

<script>
import LeftMenu from './LeftMenu'
import TooltipMenu from '../components/menu/TooltipMenu'
export default {
  name: 'GzAside',
  components: {
    LeftMenu,
    TooltipMenu
  },
  data () {
    return {
      collapse: true
    }
  }
}
</script>

<style scoped>
  aside{
    height: 100vh;
    background-color:  #1e2d44;
  }
</style>
