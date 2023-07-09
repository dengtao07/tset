import { defaultRouterMap } from "../../router";

const globalrouter = {
  state: {
    routers: defaultRouterMap,
    addRouters: [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = defaultRouterMap.concat(routers);
      sessionStorage.setItem("routes", JSON.stringify(state.routers));
    },
  },
  actions: {
    GenerateRoutes({ commit }, asyncRouter) {
      commit("SET_ROUTERS", asyncRouter);
    },
  },
};

export default globalrouter;
