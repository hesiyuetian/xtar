<template>
  <div id="app">
    <div class='kline'>
      <xtar-k-line :src='src'></xtar-k-line>
    </div>
    
    <div class='symbole'>
      <xtar-market></xtar-market>
    </div>
    
    <div class='depth'>
      <xtar-depth :mode='mode'></xtar-depth>
    </div>
    <div class='new'>
      <xtar-new-trade></xtar-new-trade>
    </div>
    <div class='trde'>
      <xtar-transaction></xtar-transaction>
    </div>
    <div class='orderlist'>
      <xtar-order-list></xtar-order-list>
    </div>

  </div>
</template>

<script>
// declare var TradingView;
// declare var Datafeeds;
import load from './utils/loading'
load.reset();
export default {
  name: "app",
  data() {
    return {
      msg: false,
      mode: true,
      src: 'static/trading/'
    };
  },
  created() {
    
  },
  computed: {},
  methods: {
    comin(){
      load.tipSuccessShow("我错了大哥")
    }
  },
};
</script>

<style lang="scss" scoped>
#app{
  width: 100%;
  height: 100%;
  .kline{
    width: 1000px;
    height: 800px;
  }
  .symbole{
    width: 300px;
    height: 700px;
    display: inline-block
  }
  .depth{
    width: 400px;
    height: 700px;
    display: inline-block;
    margin: 0 40px;
  }
  .new{
    width: 450px;
    height: 700px;
    display: inline-block
  }
  .trde{
    // width: 800px;
    height: 285px;
    margin: 20px 0;
  }
  .orderlist{
    margin-top: 30px;
  }
}
</style>
