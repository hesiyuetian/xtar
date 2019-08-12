import './lib/theme/loading.css'
import 'jquery';

// base
import xtarPaginator from './packages/paginator/index'
import xtarLoad from './packages/base/load/index'
import xtarNoData from './packages/base/noData/index'

import xtarMarket from './packages/market/index'
import xtarOrderList from './packages/orderList/index'
import xtarDepth from './packages/depth/index'
import xtarNewTrade from './packages/newTrade'
import xtarTransaction from './packages/transaction'
import xtarKLine from './packages/kLine'
import xtarUnlock from './packages/unlock'

import reset from './utils/resetData'
reset.resetTicker();

const components = [
    xtarPaginator,
    xtarLoad,
    xtarNoData,

    xtarMarket,
    xtarOrderList,
    xtarDepth,
    xtarNewTrade,
    xtarTransaction,
    xtarKLine,
    xtarUnlock
]

const install = function (Vue, opts = {}) {
    components.forEach(component => {
        Vue.component(component.name, component);
    });
};

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    xtarPaginator,
    xtarLoad,
    xtarNoData,
    xtarMarket,
    xtarOrderList,
    xtarDepth,
    xtarNewTrade,
    xtarTransaction,
    xtarKLine
}