<template>
  <section class="c-container" :class="{ 'is-vertical': isVertical }">
    <slot/>
  </section>
</template>

<script>
export default {
  name: 'Container',
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
          return tag === 'c-header' || tag === 'c-footer'
        })
        : false
    }
  }
}
</script>

<style scoped lang="less">
.c-container {
  display: flex;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  background-color: #1e2d44;
}
.is-vertical{
  flex-direction: column;
}
</style>
