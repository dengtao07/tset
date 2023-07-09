//路由守卫
import router, {
  defaultRouterMap,
  allButLedRouterMap,
  manageRouterMap,
  LedRouterMap,
} from "./index";
import { getToken, removeToken, setToken } from "../util/app";
import { getUrlKey } from "../plugins/urlGet";
import axios from "@/plugins/axios";
import store from "../store";
import S_BustypeManage from "../components/S_BustypeManage.vue";

//声明白名单
const whiteRouter = ["/nopermit", "/404"]; //indexOf 方法，判断数组中是否存在某个指定的对象，如果不存在，则返回 -1

router.beforeEach(async (to, from, next) => {
  next("/home");
  return;
  // const newRoutes = allButLedRouterMap.concat(manageRouterMap);
  // LoadRouters(newRoutes, to, next);

  // return;

  // console.log(from.path)
  // console.log(to.path)

  // if(to.path === '/aa' || to.path === '/bushandle/ordinary'){
  if (to.path === "/aa" || to.path === "/ordinary") {
    // console.log('进到/aa或/')
    // console.log('进到/bushandle/ordinary')
    //第一次进的情况，当前用户没有角色信息
    if (
      sessionStorage.getItem("mark") === null ||
      sessionStorage.getItem("mark") === "null"
    ) {
      //去一事通验签并获取用户信息
      await getInfo();

      //根据角色赋予不同的路由
      // console.log('赋角色')
      // if(!store.getters.loadMenus) {
      if (!sessionStorage.getItem("loadMenus")) {
        store.dispatch("updateLoadMenus").then((res) => {});
        let newRoutes = {};
        if (sessionStorage.getItem("mark") === "AUD_MAG") {
          //路由更新
          // console.log('路由更新1',sessionStorage.getItem("mark"))
          newRoutes = allButLedRouterMap.concat(manageRouterMap);
          newRoutes.push({ path: "*", redirect: "/404", hidden: true });
        } else if (sessionStorage.getItem("mark") === "AUD_LED") {
          newRoutes = LedRouterMap;
          // newRoutes = allButLedRouterMap
          newRoutes.push({ path: "*", redirect: "/404", hidden: true });
        } else {
          //路由更新
          // console.log('路由更新2',sessionStorage.getItem("mark"))
          newRoutes = allButLedRouterMap;
          newRoutes.push({ path: "*", redirect: "/404", hidden: true });
        }
        LoadRouters(newRoutes, to, next);
        // console.log(router)
        // console.log('添加完路由了')
        next();
      } else {
        next();
      }
    } else {
      //如果已经获得角色，想去哪里去哪里
      // console.log('来到位置2了')
      let newRoutes2 = {};
      if (sessionStorage.getItem("mark") === "AUD_MAG") {
        //路由更新
        // console.log('路由更新1',sessionStorage.getItem("mark"))
        newRoutes2 = allButLedRouterMap.concat(manageRouterMap);
        newRoutes2.push({ path: "*", redirect: "/404", hidden: true });
      } else if (sessionStorage.getItem("mark") === "AUD_LED") {
        newRoutes2 = LedRouterMap;
        // newRoutes2 = allButLedRouterMap
        newRoutes2.push({ path: "*", redirect: "/404", hidden: true });
      } else {
        //路由更新
        newRoutes2 = allButLedRouterMap;
        // console.log('路由更新2',sessionStorage.getItem("mark"))
        newRoutes2.push({ path: "*", redirect: "/404", hidden: true });
      }
      LoadRouters(newRoutes2, to, next);
      next();
      // this.$router.go(0)
      // location.reload()
    }
  } else {
    next("/home");
    //如果去的不是ordinary，并且没有角色信息
    // console.log('来到位置3了')
    if (
      sessionStorage.getItem("mark") === null ||
      sessionStorage.getItem("mark") === "null"
    ) {
      if (whiteRouter.indexOf(to.path) !== -1) {
        next();
      }
      next("/nopermit");
    } else {
      //如果去的不是ordinary，但是拥有角色信息（因为此时肯定已经通过一事通进来了的）
      //刷新的情况
      console.log(router);
      // next();

      console.log(sessionStorage.getItem("loadMenus"));
      // console.log('来到位置6了')
      store.dispatch("updateLoadMenus").then((res) => {});
      let newRoutes3 = {};
      if (sessionStorage.getItem("mark") === "AUD_MAG") {
        //路由更新
        // console.log('路由更新1',sessionStorage.getItem("mark"))
        newRoutes3 = allButLedRouterMap.concat(manageRouterMap);
        newRoutes3.push({ path: "*", redirect: "/404", hidden: true });
      } else if (sessionStorage.getItem("mark") === "AUD_LED") {
        newRoutes3 = LedRouterMap;
        // newRoutes = allButLedRouterMap
        newRoutes3.push({ path: "*", redirect: "/404", hidden: true });
      } else {
        //路由更新
        // console.log('路由更新2',sessionStorage.getItem("mark"))
        newRoutes3 = allButLedRouterMap;
        newRoutes3.push({ path: "*", redirect: "/404", hidden: true });
      }
      LoadRouters(newRoutes3, to, next);
      // console.log(router)
      // console.log('添加完路由了')
      next();
    }
  }
});

// 添加路由
export function LoadRouters(newRoutes, to, next) {
  store.dispatch("GenerateRoutes", newRoutes).then(() => {
    router.addRoutes(newRoutes); // 动态添加可访问路由表
    // console.log(newRoutes)
    // next({ ...to, replace: true })// hack方法 确保addRoutes已完成
  });
  // next({ ...to, replace: true })
}

// export async function getInfo() {
//   //const url = window.location.href;
//   //console.log(url);
//   const data = getUrlKey("Data");
//   //console.log("data",data)
//   const token = getUrlKey("Token");
//   await verify(data, token);
// }
// export async function verify(data, token) {
//   let ob = { data: "", sign: "" };
//   ob.data = data;
//   ob.sign = token;
//   //console.log("verify中的data",data)
//   await axios({
//     url: "/Login/verify",
//     method: "POST",
//     async: false,
//     data: ob,
//   })
//     .then(async (res) => {
//       if (res.data.errCode === 100) {
//         setToken(res.data.token); //将token存入cookie
//         await Csp(data, token);
//       } else {
//         alert("验证未通过，请重新登陆");
//       }
//     })
//     .catch(function(error) {
//       console.log(error);
//     });
// }
// export async function Csp(data, token) {
//   await axios({
//     url: "/Csp/getUser",
//     method: "POST",
//     async: false,
//     params: {
//       userData: data,
//     },
//   })
//     .then((res) => {
//       //console.log(res.data);
//       sessionStorage.setItem("ystId", res.data.ystId); //一事通
//       sessionStorage.setItem("userName", res.data.userName); //姓名
//       sessionStorage.setItem("mark", res.data.mark); //角色
//       sessionStorage.setItem("data", data);
//       sessionStorage.setItem("token", token);
//       // console.log('set了的')
//       if (
//         res.data.mark !== "AUD_REC" &&
//         res.data.mark !== "AUD_MAG" &&
//         res.data.mark !== "AUD_ERS" &&
//         res.data.mark !== "AUD_LED"
//       ) {
//         toNoPermit();
//       }
//     })
//     .catch(function(error) {
//       console.log(error);
//     });
// }
export function toNoPermit() {
  router.push("/nopermit");
}
// export function toOrdinary (){
//     router.push('/bushandle/ordinary')
// }
