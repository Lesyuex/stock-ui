<template>
  <div class="plate-wrap">
    <h4>
      领跌
    </h4>
    <div style="height: 50%;display: flex;justify-content: space-between;flex-wrap: wrap;align-content: space-around">
      <div style="height: 45%;float: left;width: 33%;background-color: red">

      </div>
      <div style="height: 45%;float: left;width: 33%;background-color: red">

      </div>
      <div style="height: 45%;float: left;width: 33%;background-color: red">

      </div>
      <div style="height: 45%;float: left;width: 33%;background-color: red">

      </div>
      <div style="height: 45%;float: left;width: 33%;background-color: red">

      </div>
      <div style="height: 45%;float: left;width: 33%;background-color: red">

      </div>
    </div>
    <h4>
      领跌
    </h4>
    <div style="height: 50%;display: flex;justify-content: space-between;flex-wrap: wrap;align-content: space-around">
      <div style="height: 45%;float: left;width: 33%;background-color: red">

      </div>
      <div style="height: 45%;float: left;width: 33%;background-color: red">

      </div>
      <div style="height: 45%;float: left;width: 33%;background-color: red">

      </div>
      <div style="height: 45%;float: left;width: 33%;background-color: red">

      </div>
      <div style="height: 45%;float: left;width: 33%;background-color: red">

      </div>
      <div style="height: 45%;float: left;width: 33%;background-color: red">

      </div>
    </div>
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
  background-color: #1e2d44;
  border-radius: 5px;

  &:nth-child(1) {
    border-right: 1px solid black;
    box-sizing: border-box;
  }
}
</style>
