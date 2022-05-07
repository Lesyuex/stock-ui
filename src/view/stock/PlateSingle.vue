<template>
  <div class="plate-wrap">
    领涨 - 领跌
  </div>
</template>

<script>
export default {
  name: 'PlateSingle'
}
</script>

<style scoped lang="less">
.plate-wrap {
  width: calc(100% - 8px);
  margin: 0 4px;
  height: calc((100vh - 68px)/2 - 8px);
  min-height: 420px;
  background-color: #161a23;
  border-radius: 5px;

  &:nth-child(1) {
    border-right: 1px solid black;
    box-sizing: border-box;
  }
}
</style>
