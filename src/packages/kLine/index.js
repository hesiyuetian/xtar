import xtarKLine from './src';

/* istanbul ignore next */
xtarKLine.install = function(Vue) {
  Vue.component(xtarKLine.name, xtarKLine);
};

export default xtarKLine;