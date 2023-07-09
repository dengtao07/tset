const loadflag = {
  state: {
    loadMenus: false,
  },
  mutations: {
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
      sessionStorage.setItem('loadMenus',loadMenus)
      // console.log(state.loadMenus)
    },
  },
  actions: {
    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', true)
      }).catch(err=>console.log(err))
    },
  },
}

export default loadflag

