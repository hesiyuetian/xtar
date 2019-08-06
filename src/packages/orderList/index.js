import xtarOrderList from './src';
/* istanbul ignore next */
xtarOrderList.install = function(Vue) {
  Vue.component(xtarOrderList.name, xtarOrderList);
};

export default xtarOrderList;