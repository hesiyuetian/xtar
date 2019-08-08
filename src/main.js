import Vue from 'vue'
import App from './App.vue'
import './lib/theme/iconfont/iconfont.css'


// base
import xtarLoad from './packages/base/load/index'
import xtarNoData from './packages/base/noData/index'

import xtarMarket from './packages/market/index'
import xtarOrderList from './packages/orderList/index'
import xtarDepth from './packages/depth/index'
import xtarNewTrade from './packages/newTrade'
import xtarTransaction from './packages/transaction'
import xtarKLine from './packages/kLine'
// import xtarSlide from './packages/depth/index'
// import xtarSlide from './packages/kLine/index'
// import xtarSlide from './packages/newTrade/index'
// import xtarSlide from './packages/transaction/index'
// import xtarSlide from './packages/orderList/index'

import reset from './utils/resetData'
reset.resetTicker();

const components = [
    xtarLoad,
    xtarNoData,

    xtarMarket,
    xtarOrderList,
    xtarDepth,
    xtarNewTrade,
    xtarTransaction,
    xtarKLine
]

components.forEach(component => {
    Vue.component(component.name, component);
});

new Vue({
  el: '#app',
  render: h => h(App)
})
