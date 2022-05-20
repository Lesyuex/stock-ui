<template>
  <header class="gz-header" :style="{ height,padding: '8px 12px 0 ' }">
    <slot/>
  </header>
</template>

<script>
export default {
  name: 'GzHeader',
  props: {
    height: {
      type: String,
      default: '48px'
    }
  }
}
</script>

<style scoped>
header{
  width: 100%;
  box-sizing: border-box;
}
</style>
