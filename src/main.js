import Vue from 'vue'
import App from './App.vue'
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

components.forEach(component => {
    Vue.component(component.name, component);
});

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
