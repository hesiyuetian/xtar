
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import refining from './exchang/refining'

export default new Vuex.Store({
  modules: {
    refining
  }
});
