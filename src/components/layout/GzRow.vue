<template>
  <div class="g-row">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'GRow'
}
</script>

<style scoped lang="less">
.g-row {
  position: relative;
  width: 100%;
  /*清除浮动*/
  &::before, &::after {
    content: '';
    display: table;
    clear: both;
  }
  *{
    box-sizing: border-box;
  }
  >div{
    /*使用float布局*/
    float: left;
  }
}
</style>
