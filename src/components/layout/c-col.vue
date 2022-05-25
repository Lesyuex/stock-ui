<template>
  <div :class="classList">
    <slot/>
  </div>
</template>

<script>

export default {
  name: 'c-col',
  props: {
    class: String,
    span: [String, Number],
    sm: [String, Number],
    md: [String, Number],
    lg: [String, Number]
  },
  computed: {
    classList () {
      const classList = ['c-col']
      if (this.$props.span) classList.push(`c-col-${this.$props.span}`)
      if (this.$props.sm) classList.push(`c-col-sm-${this.$props.sm}`)
      if (this.$props.md) classList.push(`c-col-md-${this.$props.md}`)
      if (this.$props.lg) classList.push(`c-col-lg-${this.$props.lg}`)
      if (this.$props.class) classList.push(this.$props.class)
      return classList
    }
  }
}
</script>
<style scoped lang="less">
</style>
