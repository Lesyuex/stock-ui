<template>
  <div class="stock">
    <div>
      今开 3107.09
    </div>
    <div>
      今开 3107.09
    </div>
    <div>
      今开 3107.09
    </div>
  </div>
</template>

<script>
import VueCard from '../../components/layout/VueCard'
export default {
  name: 'Test2',
  components: {
    VueCard
  }
}
</script>

<style scoped>
html{
  font-size: calc(100% / 34 + 0px);
}
*{
  margin: 0;
}
.stock{
  width: 50%;
  height: 100vh;
  background-color: #a17f7f;
  display: flex;
  flex-wrap: wrap;

}
.stock div{
  height: 40px;
  font-size: 1rem;
  flex: 1;
  min-width: 160px;
}

/*
@media screen and (max-width: 1000px){
  html{
    font-size: 14px;
  }
  .stock{
    background-color: #01d078;
  }
}
@media screen and (min-width:1001px) and (max-width: 1980px){
  html{
    font-size: 28px;
  }
  .stock{
    background-color: darkgray;
  }
}
@media screen and (min-width: 1981px) {

}
*/

</style>
