import Vue from "vue";
import Router from "vue-router";
import Home from "../components/Home.vue";
import ManageBusi from "../components/ManageBusi.vue";
import S_BustypeManage from "../components/S_BustypeManage.vue";
import HandleBusi from "../components/HandleBusi.vue";
import DetailBusi from "../components/DetailBusi.vue";
import S_ReserveManage from "../components/S_ReserveManage.vue";
import Login from "../components/Login.vue";
import E404 from "../components/404.vue";
import NoPermit from "../components/NoPermit.vue";
import S_StaffDispatch from "../components/S_StaffDispatch.vue";
import Iter1 from "../components/FirstIteration.vue";
import S_OperLog from "../components/S_OperLog.vue";
import HandleBusiText from "../components/HandleBusiText.vue";
import ManageBusiText from "../components/ManageBusiText.vue";
import DetailBusiText from "../components/DetailBusiText.vue";
import { Avatar } from "element-ui";

Vue.use(Router);
//默认都可以访问的路由
export const defaultRouterMap = [
  {
    path: "/nopermit",
    name: "nopermit",
    component: NoPermit,
    hidden: true,
    meta: {
      title: "无权限界面",
    },
  },
  {
    path: "/login",
    name: "登录",
    component: Login,
    hidden: true,
    meta: {
      title: "登录界面",
    },
  },
  {
    path: "/404",
    name: "404",
    component: E404,
    hidden: true,
    meta: {
      title: "404界面",
    },
  },
  {
    path: "/home",
    component: Home,
    name: "业务列表",
    icon: "el-icon-s-operation",
    meta: {
      title: "业务列表",
    },
    children: [
      { path: "404", component: E404 },
      {
        path: "handleBusiText",
        component: HandleBusiText,
      },
    ],
  },
  {
    path: "/index",
    hidden: true,
    // redirect: '/bushandle/ordinary'
    redirect: "/home",
  },
];

export const allButLedRouterMap = [
  {
    path: "/home",
    redirect: "/bushandle",
    component: Home,
    name: "业务列表",
    icon: "el-icon-s-operation",
    meta: {
      title: "业务列表",
    },
    children: [
      {
        path: "/bushandle",
        redirect: "/ordinary",
        name: "业务处理",
        icon: "el-icon-edit-outline",
        component: Iter1,
        meta: {
          title: "业务处理",
        },
        children: [
          {
            path: "/ordinary",
            name: "普通业务",
            icon: "el-icon-document",
            component: HandleBusi,
            meta: {
              titile: "普通业务",
            },
          },
          {
            path: "/handleBusiText",
            name: "文本业务",
            icon: "el-icon-document-checked",
            component: E404,
            meta: {
              titile: "文本业务",
            },
          },
        ],
      },
      {
        path: "/busmanage",
        redirect: "/manageBusi",
        name: "业务管理",
        icon: "el-icon-document-copy",
        component: Iter1,
        meta: {
          title: "业务管理",
        },
        children: [
          {
            path: "/manageBusi",
            name: "普通业务",
            icon: "el-icon-document",
            component: ManageBusi,
            meta: {
              title: "普通业务",
            },
          },
          {
            path: "/manageBusiText",
            name: "文本业务",
            icon: "el-icon-document-checked",
            component: ManageBusiText,
            meta: {
              titile: "文本业务",
            },
          },
        ],
      },
    ],
  },
  {
    path: "/buslist",
    redirect: "/detailBusi",
    component: Home,
    name: "业务详情",
    icon: "el-icon-collection-tag",
    meta: {
      title: "业务详情",
    },
    children: [
      {
        path: "/detailBusi",
        name: "普通业务",
        icon: "el-icon-document",
        component: DetailBusi,
        meta: {
          title: "普通业务",
        },
      },
      {
        path: "/detailBusiText",
        name: "文本业务",
        icon: "el-icon-document-checked",
        component: DetailBusiText,
        meta: {
          title: "文本业务",
        },
      },
    ],
  },
];

export const manageRouterMap = [
  {
    path: "/sysManage",
    name: "系统管理",
    redirect: "/bustype",
    component: Home,
    icon: "el-icon-setting",
    meta: {
      title: "系统管理",
    },
    children: [
      {
        path: "/bustype",
        name: "业务品种",
        icon: "el-icon-news",
        component: S_BustypeManage,
        meta: {
          title: "业务品种",
        },
      },
      {
        path: "/reserveManage",
        name: "预约管理",
        icon: "el-icon-time",
        component: S_ReserveManage,
        meta: {
          title: "预约管理",
        },
      },
      {
        path: "/operlog",
        name: "系统日志",
        icon: "el-icon-time",
        component: S_OperLog,
        meta: {
          title: "系统日志",
        },
      },
      {
        path: "/staffDispatch",
        name: "人员调度",
        icon: "el-icon-user",
        component: S_StaffDispatch,
        meta: {
          title: "系统日志",
        },
      },
    ],
  },
];

export const LedRouterMap = [
  {
    path: "/bushandle",
    name: "业务管理",
    redirect: "/ordinary",
    icon: "el-icon-document-copy",
    component: Home,
    meta: {
      title: "业务管理",
    },
    children: [
      {
        path: "/ordinary",
        name: "普通业务",
        icon: "el-icon-document",
        component: ManageBusi,
        meta: {
          title: "普通业务",
        },
      },
      {
        path: "/handleBusiText",
        name: "文本业务",
        icon: "el-icon-document-checked",
        component: ManageBusiText,
        meta: {
          titile: "文本业务",
        },
      },
    ],
  },
];

export const ALL_ROUTER = [
  ...defaultRouterMap,
  ...allButLedRouterMap,
  ...manageRouterMap,
  ...LedRouterMap,
];

const router = new Router({
  mode: "history",
  // 测试
  routes: defaultRouterMap,
});

export default router;
