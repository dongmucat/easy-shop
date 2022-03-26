import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import Moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
/* 导入 nprogress 和样式*/
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//导入全局样式表
import './assets/css/global.css'
Vue.config.productionTip = false
//注册表格组件
Vue.component('tree-table', TreeTable)
/* 将富文本编辑器，注册为全局可用 */
Vue.use(VueQuillEditor)

//设置基准地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
//添加aixos拦截器，在请求头中增加token
// 添加请求拦截器,在request拦截器中,展示进度条
axios.interceptors.request.use(function (config) {
  NProgress.start();
  // 在发送请求之前做些什么
  config.headers.Authorization = window.sessionStorage.getItem('token');
  /* console.log(config); */
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
/* 在reponse拦截器中,隐藏进度条 */
axios.interceptors.response.use(function (config) {
  NProgress.done();
  return config;

});
/* 过滤器 */
Vue.filter('dateFormat', function (value) {
  return Moment(value).format('YYYY-MM-DD HH:mm:ss')
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
