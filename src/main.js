import Vue from 'vue'
import axios from './plugins/axios'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/element.js'
import 'element-theme-chalk';
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
//一定要引用和挂载
import store from './store'
//引入全局样式表
import './assets/css/global.css'
import './plugins/preventClick.js'
// 导入NProgress, 包对应的JS和CSS
import 'default-passive-events'
//导入路由权限控制
// import './router/permit'
import VueCompositionApi from '@vue/composition-api'

Vue.config.productionTip = false;
Vue.use(ElementUI);


// 生产环境
// axios.defaults.baseURL = 'http://cqaarn.bcsoa.cmbchina.cn/api';
// 测试环境（tomcat部署后端时）
axios.defaults.baseURL = 'http://99.180.21.53:8085';


// 挂在到Vue实例，后面可通过this调用
Vue.prototype.$http = axios;
//权限控制
Vue.use(VueCompositionApi);

Vue.config.productionTip = false;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
