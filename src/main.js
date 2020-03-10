// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import './assets/css/global.css'
import Vuex from 'vuex'
// 导入字体图标
import './assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(Vuex)
var store=new Vuex.Store({
  state:{}
})
Vue.filter('dateFormat',function(originVal){
    const dt= new Date(originVal)
    const y = dt.getFullYear()
    const m=(dt.getMonth()+1+'').padStart(2,'0')
    const d=(dt.getDate()+'').padStart(2,'0')

    const hh=(dt.getHours()+'').padStart(2,'0')
    const mm=(dt.getMinutes()+'').padStart(2,'0')
    const ss=(dt.getSeconds()+'').padStart(2,'0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.use(axios)
Vue.component('tree-table',ZkTable)
axios.interceptors.request.use(config=>{
  config.headers.authorization=window.sessionStorage.getItem("token")
  //最后必须return config
  return config
})
Vue.prototype.$http=axios
// 配置请求的默认根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
