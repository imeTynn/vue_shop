import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/cate.vue'
import GoodsList from '../components/goods/list.vue'
import add from '../components/goods/add.vue'
import order from '../components/order/order.vue'
import report from '../components/report/report'
Vue.use(Router)

const router= new Router({
  routes: [
     {path:'/',redirect:'/login'},
     {path:'/login',component:Login},
     {path:"/home",component:Home,redirect:'/welcome',children:[
       {path:'/welcome',component:Welcome},
       {path:'/users',component:Users},
       {path:'/rights',component:Rights},
       {path:'/roles',component:Roles},
       {path:'/categories',component:Cate},
       {path:"/goods",component:GoodsList},
       {path:'/goods/add',component:add},
       {path:'/orders',component:order},
       {path:'/reports',component:report}
     ]}
     
  ]
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next是一个函数，表示放行
   // next()放行  next('/login')强制跳转的路径
   if(to.path=='/login') return next()
   const token=window.sessionStorage.getItem('token')
   if(!token){
      return next('/login')
   }else{
     return next()
   }
})
export default router
