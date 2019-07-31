import store from './store/index';

import xtarDate from './packages/date/index'
import xtarPaginator from './packages/paginator/index'
import xtarSlide from './packages/slide/index'
// import './lib/reset.scss'

const components = [
    xtarDate,
    xtarPaginator,
    xtarSlide
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

new Vue({
    store
})

export default {
    install,
    xtarDate,
    xtarPaginator,
    xtarSlide
}