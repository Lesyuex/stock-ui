<template>
  <div class="plate-wrap">
    <h3 class="title-wrap">领涨板块</h3>
    <div class="increase-wrap">
      <div class="plate-box" :key="i"
           v-for="i in [6,5,4,3,2,1]">
        {{ i }}
      </div>
    </div>
    <h3 class="title-wrap">领跌板块</h3>
    <div class="unincrease-wrap">
      <div class="plate-box" :key="i"
           v-for="i in [6,5,4,3,2,1]">
        {{ i }}
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
  height: 486px;
  padding: 8px 8px 0 8px;
  box-sizing: border-box;
  background-color: #1e2d44;
  border-radius: 5px;

  .title-wrap {
    font-size: 18px;
    line-height: 30px;
  }

  .increase-wrap, .unincrease-wrap {
    height: 209px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-content: space-around;

    .plate-box {
      width: calc((100% - 16px)/3);
      height: 92.5px;
      margin-bottom: 8px;
      float: left;
      background: #b63744;
      &:nth-child(-n + 3) {
        margin-top: 8px;
      }

      &:nth-child(2), &:nth-child(5) {
        margin-left: 8px;
        margin-right: 8px;
      }
    }
  }
}
</style>
