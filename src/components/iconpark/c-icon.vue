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
      type: String,
      default: '#ccc'
    }
  },
  data () {
    return {

    }
  },
  /*   render: function (createElement) {
    return createElement('h1', '23232')
  } */
  render: function (h) {
    const {name, theme, size, fill} = this.$props
    console.log(this.$props)
    const icon = {
      template: `<ipark-${name} theme="${theme}" size="${size}" fill="${fill}"></ipark-home>`
    }
    return h(icon)
  }
}
</script>

<style scoped>

</style>
