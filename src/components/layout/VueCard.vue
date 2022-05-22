<template>
  <div class="card-wrap" >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'VueCard'
}
</script>
<style scoped>
.card-wrap{
  height: calc(100vh - 58px);
  background-color: transparent;
  padding:0 6px;
  overflow: auto;
  overflow-y: overlay;
  box-sizing: border-box;
}
.card-wrap::before,.card-wrap::after{
  content: '';
  display: block;
  clear: both;
}
.card-wrap::-webkit-scrollbar{
  width:4px;
}
/*定义滚动条*/
.card-wrap::-webkit-scrollbar-thumb {
   border-radius:4px;
  -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.2);
   background: white;
 }
/*定义滚动条轨道*/
.card-wrap::-webkit-scrollbar-track {
   -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.2);
   border-radius: 0;
   background: rgba(0, 0, 0, 0.2);
 }
</style>
