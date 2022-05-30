<script>
export default {
  name: 'c-icon',
  props: {
    name: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: 'outline'
    },
    size: {
      type: [Number, String],
      default: 24
    },
    fill: {
      type: [String, Array],
      default: '#ccc'
    }
  },
  render: function (h) {
    const {name, theme, size, fill} = this.$props
    const props = {
      theme,
      size,
      fill
    }
    // const tagName = `ipark-${name}`
    return h(name, {...{props}})
  }
}
</script>

<style scoped>

</style>
