const state = {
  isCollapse: false,
  selectMenu: [],
  routerList: [],
  menuActive: '1-1'
}
const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse
  },
  addMenu(state, payload) {
    //去重数据
    if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
      state.selectMenu.push(payload)
    }
  },
  closeMenu(state, payload) {
    const index = state.selectMenu.findIndex(val => val.name === payload.name)
    //通过索引删除数据
    state.selectMenu.splice(index, 1)
  },
  dynamicMenu(state, payload) {
    // console.log(payload)
    const modules = import.meta.glob('../views/**/**/*.vue')
    console.log(modules)
    function routerSet(router) {
      //判断没有子菜单，拼接路由
      router.forEach(route => {
        if (!route.children) {
          const url = `../views${route.meta.path}/index.vue`
          //拿到获取的vue组件
          route.component = modules[url]
        }
        //递归调用
        else {
          routerSet(route.children)
        }

      });
    }
    routerSet(payload)
    state.routerList = payload
  },
  updateMenuActive(state, payload) {
    state.menuActive = payload
  }
}
export default {
  state,
  mutations
}