<template>
  <div class="card-wrap" >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'Card'
}
</script>
<style scoped>
.card-wrap{
  height: calc(100vh - 56px);
  background-color: transparent;
  padding:0 4px;
  overflow: auto;
  overflow-y: overlay;
  box-sizing: border-box;
}
.card-wrap::before,.card-wrap::after{
  content: '';
  display: block;
  clear: both;
}

</style>
