<template>
  <div class="plate-wrap">

  </div>
</template>

<script>
export default {
  name: 'PlateSingle'
}
</script>

<style scoped lang="less">
.plate-wrap {
  width: 100%;
  height: 420px;
  margin: 8px 0;
  background-color: #ccc;

  &:nth-child(1) {
    border-right: 1px solid black;
    box-sizing: border-box;
  }
}
</style>
