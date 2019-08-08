import xtarNewTrade from './src';
/* istanbul ignore next */
xtarNewTrade.install = function(Vue) {
  Vue.component(xtarNewTrade.name, xtarNewTrade);
};

export default xtarNewTrade;