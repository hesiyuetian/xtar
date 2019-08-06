// base
import xtarPaginator from './packages/paginator/index'
import xtarLoad from './packages/base/load/index'
import xtarNoData from './packages/base/noData/index'

import xtarMarket from './packages/market/index'
import xtarOrderList from './packages/orderList/index'

import reset from './utils/resetData'

const components = [
    xtarPaginator,
    xtarLoad,
    xtarNoData,
    xtarMarket,
    xtarOrderList
]

const install = function (Vue, opts = {}) {
    reset.resetTicker();
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
    xtarOrderList
}