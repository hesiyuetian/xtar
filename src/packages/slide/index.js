import xtarSlide from './src';

/* istanbul ignore next  */
xtarSlide.install = function(Vue) {
  Vue.component(xtarSlide.name, xtarSlide);
};

export default xtarSlide;