import xtarLoad from './index.vue';
/* istanbul ignore next */
xtarLoad.install = function(Vue) {
  Vue.component(xtarLoad.name, xtarLoad);
};

export default xtarLoad;