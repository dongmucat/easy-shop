import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)

const Welcome = ()=>import('../views/Welcome.vue')
const Login  = ()=>import('../views/Login.vue')
const Home = ()=>import('../views/Home.vue')
const Users = ()=>import('../views/user/Users.vue')
const Rights = ()=>import('../views/power/Rights.vue')


const routes = [
  //重定向，默认是/login
  {
    path:'/',
    redirect:'/login'

  },
  {
    path:'/login',
    name:'login',
    component:Login,

  },
  {
    path:'/home',
    name:'home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        name:'welcome',
        component:Welcome,
      },
      {
        path:'/users',
        name:'users',
        component:Users,
      },
      {
        path:'/rights',
        name:'rights',
        component:Rights,
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//全局前置守卫：初始化时执行、每次路由切换前执行
router.beforeEach((to,from,next)=>{
	//如果是要去/login则直接放行
  if(to.name === 'login'){
    return next();
  }
  else{
    const tokenObj = window.sessionStorage.getItem('token')
    //如果token为空则应该跳转到login页面重新登录
    if(!tokenObj) return next({name:'login'})
    next();

  } 
  

})

export default router
