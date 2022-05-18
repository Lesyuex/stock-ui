<script>

export default {
  name: 'Submenu',
  created () {
    console.log(this.$slots)
  },
  render (h) {
    return h('li', [
      this.$scopedSlots.title,
      this.$scopedSlots.default
    ])
  }
}
</script>

<style scoped>

</style>
