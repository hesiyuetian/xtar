import xtarDate from './packages/date/index'
import xtarPaginator from './packages/paginator/index'
import xtarSlide from './packages/slide/index'
// import './lib/reset.scss'

import api from './service/index'
import stores from './dataStore/index'

const components = [
    xtarDate,
    xtarPaginator,
    xtarSlide
]

const install = function (Vue, opts = {}) {
    api.pairs().then(res => {
        console.log('index.js',res.data)
        stores.pairs = res.data
    })
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
    xtarDate,
    xtarPaginator,
    xtarSlide
}