<template>
  <section>
    <g-row>
      <g-col :sm="24" :md="24" :lg="12">1</g-col>
      <g-col :sm="12" :md="18" :lg="8">1</g-col>
      <g-col :sm="6" :md="10" :lg="6">1</g-col>
    </g-row>
    <div class="box1 box3">
      box1
    </div>

    <div class="box2">
      box2
    </div>
  </section>

</template>

<script>
export default {
  name: 'Test'
}
</script>

<style scoped lang="less">
section {
  width: 100%;
  height: calc(100vh - 40px);
  background-color: #051e2e;
  box-sizing: border-box;
  *{
    box-sizing: border-box;
  }
}
[class^=box1]{
  height: 100px;
  background-color: skyblue;
}
</style>
