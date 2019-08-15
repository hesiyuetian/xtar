import xtarAlert from './index.vue';
/* istanbul ignore next */
xtarAlert.install = function(Vue) {
  Vue.component(xtarAlert.name, xtarAlert);
};

export default xtarAlert;