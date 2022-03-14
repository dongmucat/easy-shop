import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import  TreeTable  from 'vue-table-with-tree-grid'
//导入全局样式表
import './assets/css/global.css'
Vue.config.productionTip = false
//注册表格组件
Vue.component('tree-table',TreeTable)


//设置基准地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
//添加aixos拦截器，在请求头中增加token
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = window.sessionStorage.getItem('token');
  /* console.log(config); */
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
