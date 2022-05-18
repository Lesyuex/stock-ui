<script>
export default {
  name: 'Submenu2',
  created () {
    console.log(this.$slots)
  },
  render (h) {
    return h('h3', [
      this.$scopedSlots.default({title: this.title})
    ])
  }
}
</script>

<style scoped>

</style>
