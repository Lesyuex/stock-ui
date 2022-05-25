<template>
<div class="c-row">
  <slot/>
</div>
</template>

<script>
export default {
  name: 'Row'
}
</script>

<style scoped lang="less">
.c-row{
  position: relative;
  /*清除浮动*/
  &::before, &::after {
    content: "";
    display: block;
    clear: both;
  }
  .c-col{
    float: left;
    box-sizing: border-box;
  }
}
</style>
