<template>
  <header class="gz-header" :style="{ height,padding: '12px 12px 4px 12px' }">
    <slot/>
  </header>
</template>

<script>
export default {
  name: 'GzHeader',
  props: {
    height: {
      type: String,
      default: '56px'
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
