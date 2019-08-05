import Vue from 'vue'
import App from './App.vue'
import './lib/theme/iconfont/iconfont.css'

import { pubSub } from './watch/index'


import xtarDate from './packages/date/index'
import xtarPaginator from './packages/paginator/index'
import xtarSlide from './packages/slide/index'

import xtarMarket from './packages/market/index'
// import xtarSlide from './packages/depth/index'
// import xtarSlide from './packages/kLine/index'
// import xtarSlide from './packages/newTrade/index'
// import xtarSlide from './packages/transaction/index'
// import xtarSlide from './packages/orderList/index'

import reset from './utils/resetData'
reset.resetTicker();

const components = [
    xtarDate,
    xtarPaginator,
    xtarSlide,

    xtarMarket
]

components.forEach(component => {
    Vue.component(component.name, component);
});

new Vue({
  el: '#app',
  render: h => h(App)
})
