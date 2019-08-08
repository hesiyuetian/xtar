import xtarDepth from './src';
/* istanbul ignore next */
xtarDepth.install = function(Vue) {
  Vue.component(xtarDepth.name, xtarDepth);
};

export default xtarDepth;