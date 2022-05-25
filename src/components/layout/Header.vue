<template>
  <header class="c-header" :style="{ height,padding: '8px 8px 0 8px' }">
    <slot/>
  </header>
</template>

<script>
export default {
  name: 'Header',
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
