import { createRouter, createWebHashHistory } from 'vue-router'



import Layout from '../views/Main.vue'
import Login from '../views/login/index.vue'
import Dashboard from '../views/dashboard/index.vue'
import Admin from '../views/auth/admin/index.vue'
import Group from '../views/auth/group/index.vue'
import Order from '../views/vppz/order/index.vue'
import Staff from '../views/vppz/staff/index.vue'
const routes = [{
  path: '/',
  component: Layout,
  name: 'main',
  redirect: to => {
    const localData = localStorage.getItem('pz_v3pz')
    if (localData) {
      //判断是否有菜单
      const child = JSON.parse(localData).menu.routerList[0].children
      if (child) {
        return child[0].meta.path
      } else {
        return JSON.parse(localData).menu.routerList[0].meta.path
      }

    }
    else {
      return '/login'
    }
  },
  children: [
    // {
    //   path: 'dashboard',
    //   meta: { id: '1', name: '控制台', icon: 'Platform', path: '/dashboard', describe: '用于展示系统数据概览和关键业务信息。' },
    //   component: Dashboard
    // },
    // {
    //   path: 'auth',
    //   meta: { id: '2', name: '权限管理', icon: 'Grid' },
    //   children: [
    //     {
    //       path: '',
    //       alias: ['admin'],
    //       meta: { id: '1', name: '账号管理', icon: 'Avatar', path: '/auth/admin', describe: '用于管理系统用户的账号信息，包括账号的创建、修改、删除等操作。' },
    //       component: Admin
    //     },
    //     {
    //       path: 'group',
    //       meta: { id: '2', name: '菜单管理', icon: 'Menu', path: '/auth/group', describe: '用于管理系统用户的菜单信息，包括菜单的创建、修改、删除等操作。' },
    //       component: Group
    //     }]
    // },
    // {
    //   path: 'vppz',
    //   meta: { id: '3', name: 'LIFE陪诊', icon: 'BellFilled' },
    //   children: [{
    //     path: 'order',
    //     meta: { id: '1', name: '订单管理', icon: 'Document', path: '/vppz/order', describe: '用于管理系统用户的订单信息，包括订单的创建、修改、删除等操作。' },
    //     component: Order
    //   },
    //   {
    //     path: 'staff',
    //     meta: { id: '2', name: '员工管理', icon: 'UserFilled', path: '/vppz/staff', describe: '用于管理系统用户的员工信息，包括员工的创建、修改、删除等操作。' },
    //     component: Staff
    //   }
    //   ]
    // }
  ]
},
{
  path: '/login',
  component: Login
}
]
const router = createRouter({
  routes,
  //路由匹配模式
  history: createWebHashHistory()
})
export default router
