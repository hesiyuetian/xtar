import xtarUnlock from './src';

/* istanbul ignore next */
xtarUnlock.install = function(Vue) {
  Vue.component(xtarUnlock.name, xtarUnlock);
};

export default xtarUnlock;