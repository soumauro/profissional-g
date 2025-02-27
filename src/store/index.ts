import { createStore } from 'vuex'

export default createStore({
  state: {
    userUid: null,
    isloged: false
  },
  mutations: {
    setUserUid(state, {userUid: uid, isloged: isloged }) {
      state.userUid = uid;
      state.isloged = isloged;
    }
  },
  actions: {
    fetchUserUid({ commit }, {userUid: userUid, isloged:isloged }) {
      commit('setUserUid', { userUid, isloged });
    }
  },
  getters: {
    getUserUid: (state) => {
      return { userUid: state.userUid, isloged: state.isloged };
    }
  }
})