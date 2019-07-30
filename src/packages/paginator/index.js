import xtarPaginator from './src';

/* istanbul ignore next */
xtarPaginator.install = function(Vue) {
  Vue.component(xtarPaginator.name, xtarPaginator);
};

export default xtarPaginator;