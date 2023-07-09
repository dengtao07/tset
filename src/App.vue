<template>

  <div id="app">

    <!-- 路由占位符 -->

    <router-view></router-view>

  </div>

</template>

<script>
export default {
  name: "app",
};
</script>

<style>
.el-select-dropdown .el-select-dropdown__wrap {
  height: auto !important;
  max-height: 300px;
}

.el-tabs__item {
  padding: 0 20px;
  height: 40px;
  box-sizing: border-box;
  line-height: 40px;
  display: inline-block;
  list-style: none;
  font-size: 20px;
  font-weight: 500;
  color: #303133;
  position: relative;
}
</style>

