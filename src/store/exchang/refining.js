import { 
    A_SET_NUMBER,
    M_SET_NUMBER,
    G_GET_NUMBER
} from './types';

const state = {
    number: 1
};

const getters = {
    ["G_GET_NUMBER"](state) {
        return state.number;
    }
};

const actions = {
    // 进行游戏数据 
    ["A_SET_NUMBER"]({ commit },data) {
        commit("M_SET_NUMBER",data);
    }
};

const mutations = {
    ["M_SET_NUMBER"](state, data) {
        state.number = data;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
  