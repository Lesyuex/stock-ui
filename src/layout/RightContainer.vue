<template>
<section>
  <slot name="header"/>
  <slot/>
</section>
</template>

<script>
export default {
  name: 'RightContainer'
}
</script>

<style scoped>
section {
  width: 100%;
  height: 100%;
}
</style>
