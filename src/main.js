import Vue from 'vue'
import App from './App.vue'

import { pubSub } from './watch/index'

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

if( ("onhashchange" in window) && ((typeof document.documentMode==="undefined") || document.documentMode==8)) {
  // 浏览器支持onhashchange事件
  window.onhashchange = hashChangeFire;  // TODO，对应新的hash执行的操作函数
} else {
  console.log('请更换更高版本的浏览器')
}
function hashChangeFire(){
  let hash = window.location.hash.replace('#','')
  pubSub.resetData(hash)
  console.log("URL产生了变化")
}

api.pairs().then(res => {
  console.log('index.js',res.data)
  stores.pairs = res.data
})

components.forEach(component => {
    Vue.component(component.name, component);
});

new Vue({
  el: '#app',
  render: h => h(App)
})
