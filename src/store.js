import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userName: 'Mauricio',
    counter: 0
  },
  mutations: {
    setUserName(state, newName) {
      state.userName = newName;
    },
    incrementCounter(state) {
      state.counter++;
    }
  },
  actions: {
    updateUserName({ commit }, newName) {
      commit('setUserName', newName);
    },
    incrementCounterAction({ commit }) {
      commit('incrementCounter');
    }
  },
  getters: {
    getUserName: (state) => state.userName,
    getCounter: (state) => state.counter
  }
});
