<template>
  <c-card>
    <c-row>
      <c-col :span="12" :sm="24" md="12" :lg="8">
        <CIcon name="bill" :size="24"></CIcon>
      </c-col>
      <c-col :span="12" :sm="24" md="12" :lg="8">
        <ipark-home theme="outline" size="24" fill="#333"/>
      </c-col>
      <c-col :span="12" :sm="24" md="12" :lg="8">
      </c-col>
    </c-row>
  </c-card>

<!--  <div class="stock">
    <div class="minu">
      今开 3107.09
    </div >
    <div class="cont">
      今开 3107.09
    </div>
    <div class="market">
      今开 3107.09
    </div>
  </div>-->
</template>

<script>
import VueCard from '../../components/card/Card'
import CRow from '../../components/grid/Row'
import CCol from '../../components/grid/Col'
import CIcon from '../../components/iconpark/c-icon'
export default {
  name: 'Test2',
  components: {
    CCol,
    VueCard,
    CRow,
    CIcon
  }
}
</script>

<style scoped lang="less">
html{
  font-size: calc(100% / 34 + 0px);
}
*{
  margin: 0;
}
.stock{
  width: 100%;
  height: 100vh;
  background-color: white;
  display: flex;
  flex: 1;
  flex-wrap: wrap;

  >div{
    flex: 1;
    height: 400px;

    min-width: 510px;
  }
  .minu{
    background: #a17f7f;
  }
  .cont{
    background: #1d9a63;
  }
  .market{
    background: #b63744;
  }
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
