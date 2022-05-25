<template>
  <main class="c-main">
    <slot></slot>
  </main>
</template>

<script>
export default {
  name: 'Main'
}
</script>

<style scoped>
.c-main {
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
}
</style>
