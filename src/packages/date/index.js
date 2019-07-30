import xtarDate from './src';
/* istanbul ignore next */
xtarDate.install = function(Vue) {
  Vue.component(xtarDate.name, xtarDate);
};

export default xtarDate;