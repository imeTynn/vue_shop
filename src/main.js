// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(axios)
Vue.prototype.$http=axios
// 配置请求的默认根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
