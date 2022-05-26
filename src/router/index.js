import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)

const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */'../views/Welcome.vue')
const Login = () => import(/* webpackChunkName:"login_home_welcome" */'../views/Login.vue')
const Home = () => import(/* webpackChunkName:"login_home_welcome" */'../views/Home.vue')
const Users = () => import(/* webpackChunkName:"user" */'../views/user/Users.vue')
const Rights = () => import(/* webpackChunkName:"power" */ '../views/power/Rights.vue')
const Roles = () => import(/* webpackChunkName:"power" */ '../views/power/Roles.vue')
const Category = () => import(/* webpackChunkName:"goods" */'../views/goods/Category.vue')
const Params = () => import(/* webpackChunkName:"goods" */'../views/goods/Params.vue')
const List = () => import(/* webpackChunkName:"goods" */'../views/goods/List.vue')
const AddGoods = () => import(/* webpackChunkName:"goods" */'../views/goods/AddGoods.vue')
const Order = () => import(/* webpackChunkName:"order" */'../views/order/Order.vue')
const Report = () => import(/* webpackChunkName:"report" */ '../views/report/Report.vue')


const routes = [
  //重定向，默认是/login
  {
    path: '/',
    redirect: '/login'

  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: Welcome,
      },
      {
        path: '/users',
        name: 'users',
        component: Users,
      },
      {
        path: '/rights',
        name: 'rights',
        component: Rights,
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles,
      },
      {
        path: '/categories',
        name: 'categories',
        component: Category,
      },
      {
        path: '/params',
        name: 'params',
        component: Params,
      },
      {
        path: '/goods',
        name: 'goods',
        component: List,
      },
      {
        path: '/goods/add',
        name: 'add',
        component: AddGoods,
      },
      {
        path: '/orders',
        name: 'orders',
        component: Order,
      },
      {
        path: '/reports',
        name: 'reports',
        component: Report,
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

//全局前置守卫：初始化时执行、每次路由切换前执行
router.beforeEach((to, from, next) => {
  //如果是要去/login则直接放行
  if (to.name === 'login') {
    return next();
  }
  else {
    const tokenObj = window.sessionStorage.getItem('token')
    //如果token为空则应该跳转到login页面重新登录
    if (!tokenObj) return next({ name: 'login' })
    next();

  }


})

export default router
