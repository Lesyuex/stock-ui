<template>
  <aside class="c-aside">
    <slot/>
  </aside>
</template>

<script>
import LeftMenu from '../../layout/LeftMenu'
import TooltipMenu from '../menu/TooltipMenu'
export default {
  name: 'Aside',
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
    background-color:  #1e2b42;
  }
</style>
