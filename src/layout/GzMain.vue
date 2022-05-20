<template>
  <main class="gz-main">
    <slot></slot>
  </main>
</template>

<script>
export default {
  name: 'GzMain'
}
</script>

<style scoped>
.gz-main {
  display: block;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
  box-sizing: border-box;
}
</style>
