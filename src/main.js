import Vue from 'vue'
import App from './App.vue'
import './lib/theme/reset.css'
import './lib/theme/loading.css'

// base
import xtarLoad from './packages/base/load/index'
import xtarNoData from './packages/base/noData/index'
import xtarAlert from './packages/base/alert/index'
import xtarPwd from './packages/base/pwd/index'

import xtarMarket from './packages/market/index'
import xtarOrderList from './packages/orderList/index'
import xtarDepth from './packages/depth/index'
import xtarNewTrade from './packages/newTrade'
import xtarTransaction from './packages/transaction'
import xtarKLine from './packages/kLine'
import xtarUnlock from './packages/unlock'

const components = [
    xtarLoad,
    xtarNoData,
    xtarAlert,
    xtarPwd,

    xtarMarket,
    xtarOrderList,
    xtarDepth,
    xtarNewTrade,
    xtarTransaction,
    xtarKLine,
    xtarUnlock
]

components.forEach(component => {
    Vue.component(component.name, component);
});

new Vue({
  el: '#app',
  render: h => h(App)
})
