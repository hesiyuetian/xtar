import xtarMarket from './src';
/* istanbul ignore next */
xtarMarket.install = function(Vue) {
  Vue.component(xtarMarket.name, xtarMarket);
};

export default xtarMarket;