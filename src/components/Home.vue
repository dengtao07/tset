<template>

  <el-container>

    <!-- 头部 -->

    <el-header>

      <div>

        <img src="../assets/CMB.svg" alt />

        <span>招商银行重庆分行</span>

        <div class="user">

          <span>当前用户 </span>
           {{this.userName}}
        </div>

      </div>

    </el-header>

    <!-- 主体 -->

    <el-container>

      <!-- 侧边栏 -->

      <el-aside :width="isCollapse ? '64px' : '220px'">

        <div class="toggle-button" @click="toggleCollapse">|||</div>

        <!-- 开启路由，每次只打开一个菜单，加冒号代表属性绑定 -->

        <el-menu
          :router="true"
          background-color="#333744"
          @open="handleOpen"
          @close="handleClose"
          :collapse-transition="false"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          text-color="#fff"
          router
        >

          <template v-for="(item, ind) in routers">

            <el-submenu v-if="!item.hidden" :key="item.id" :index="ind + ''">

              <!-- 一级菜单 -->

              <template slot="title">

                <i :class="item.icon"></i>

                <span>{{item.name}}</span>

              </template>

              <template v-for="(subitem, subind) in item.children">

                <!-- 若无，显示二级菜单 -->

                <el-menu-item v-if="!subitem.children" :index="subitem.path">

                  <template slot="title">

                    <i :class="subitem.icon"></i>

                    <span>{{subitem.name}}</span>

                  </template>

                </el-menu-item>

                <!-- 有三级菜单的情况 -->

                <el-submenu v-else :key="subitem.id" :index="subind + ''">

                  <!-- 先显示二级菜单 -->

                  <template slot="title">

                    <i :class="subitem.icon"></i>

                    <span>{{subitem.name}}</span>

                  </template>

                  <!-- 新建 -->

                  <!-- 循环二级菜单的子项 -->

                  <template v-for="(subsubitem, subsubnnd) in subitem.children">

                    <!-- 没有四级菜单的情况 -->

                    <el-menu-item
                      v-if="!subsubitem.children"
                      :index="subsubitem.path"
                    >

                      <!-- 只显示三级菜单 -->

                      <template slot="title">

                        <i :class="subsubitem.icon"></i>

                        <span>{{subsubitem.name}}</span>

                      </template>

                    </el-menu-item>

                    <!-- 有四级菜单的情况 -->

                    <el-submenu
                      v-else
                      :key="subsubitem.path"
                      :index="subsubnnd + '99'"
                    >

                      <template slot="title">

                        <i :class="subsubitem.icon"></i>

                        <span>{{subsubitem.name}}</span>

                      </template>

                      <el-menu-item
                        v-for="(subsubsubitem,
                        subsubsubid) in subsubitem.children"
                        :key="subsubsubitem.path"
                        :index="subsubsubitem.path"
                      >

                        <template slot="title">

                          <i :class="subsubsubitem.icon"></i>

                          <span>{{subsubsubitem.name}}</span>

                        </template>

                      </el-menu-item>

                    </el-submenu>

                  </template>

                </el-submenu>

              </template>

            </el-submenu>

          </template>

        </el-menu>

      </el-aside>

      <!-- 内容主体 -->

      <el-main>

        <!-- <router-view> -->

        <router-view></router-view>

        <!-- </router-view> -->

      </el-main>

    </el-container>

  </el-container>

</template>

<script>
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
import E404 from "./404";
import { ALL_ROUTER } from "../router";
import store from "../store";
export default {
  name: "home",
  data() {
    return {
      isCollapse: false,
      userName: sessionStorage.getItem("userName"),
    };
  },
  methods: {
    //点击菜单按钮的展开折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    showcompont(item) {
      console.log(item);
    },
  },
  setup(props, { root }) {
    //data 数据
    // const routers = reactive(store.getters.globalrouters)
    const routerCopy = {
      home: "11",
      index: "22",
    };
    const routers = [
      {
        name: "home",
        id: "home",
        children: [
          {
            name: "404",
            id: "404",
            path: "404",
          },
          {
            name: "handleBusiText",
            path: "handleBusiText",
          },
        ],
      },
    ];
    // console.log('aaaaaa',JSON.parse(sessionStorage.getItem('routes')))
    // console.log('token',sessionStorage.getItem('token'))

    //函数
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };
    return {
      handleClose,
      handleOpen,
      routers,
    };
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373f41;
  display: flex;
  justify-content: space-between;
  padding-left: 19px; //左边贴边为0
  align-items: center; //上下居中
  color: #fff; //白色
  font-size: 20px;
  > div {
    display: flex; //左右贴边对齐
    align-items: center; //纵向剧中对齐
    img {
      height: 40px;
    }
    span {
      margin-left: 1px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 43px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上去变成小手
  cursor: pointer;
}
.user {
  right: 20px;
  position: absolute;
  font-size: 15px;
}
</style>

