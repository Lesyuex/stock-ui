<template>
  <section class="gz-container" :class="{ 'is-vertical': isVertical }">
    <slot/>
  </section>
</template>

<script>
export default {
  name: 'GzContainer',
  computed: {
    isVertical () {
      if (this.direction === 'vertical') {
        return true
      } else if (this.direction === 'horizontal') {
        return false
      }
      return this.$slots && this.$slots.default
        ? this.$slots.default.some(vnode => {
          const tag = vnode.componentOptions && vnode.componentOptions.tag
          return tag === 'gz-header' || tag === 'gz-footer'
        })
        : false
    }
  }
}
</script>

<style scoped lang="less">
.gz-container {
  display: flex;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  background-color: #1e2d44;
  min-width: 0;
}
.is-vertical{
  flex-direction: column;
}
</style>
