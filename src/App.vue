<template>
  <div id="app">
    <div class='kline'>
      <xtar-order-list></xtar-order-list>
    </div>
    <div class='symbole'>
      <xtar-market></xtar-market>
    </div>
    
    <div class='kline'></div>
    <div class='kline'></div>
    <div class='kline'></div>
  </div>
</template>

<script>
import load from './utils/loading'
load.reset();
export default {
  name: "app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
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
  .symbole{
    width: 300px;
    height: 500px;
  }
}
</style>
