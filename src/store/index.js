import Vue from "vue";
import Vuex from "vuex";
import loadflag from "./modules/loadflag";
import getters from "./getters";
// import globalrouter from './modules/globalrouter'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    loadflag,
    // globalrouter
  },
  getters,
});

export default store;
