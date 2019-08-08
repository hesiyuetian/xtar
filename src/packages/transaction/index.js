import xtarTransaction from './src';

/* istanbul ignore next */
xtarTransaction.install = function(Vue) {
  Vue.component(xtarTransaction.name, xtarTransaction);
};

export default xtarTransaction;