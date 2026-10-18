import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import api from './api'
  

router.beforeEach((to, from) => {
  if ( to.path !== '/login') {
    if (!localStorage.getItem('h5_token')) {
      return '/login'
    }
  }
  
})
const app = createApp(App)
//在实例上绑定属性
app.config.globalProperties.$api = api
// 挂载路由
app.use(router)
app.mount('#app')
