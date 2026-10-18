<template>
  <div class="header-container">
   <div class="header-left flex-box" >
    <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"><Fold /></el-icon>
    <ul class="flex-box">
      <li v-for="(item,index) in selectMenu"
       :key="item.path"
       :class="{selected:route.path===item.path}"
       class="tab flex-box"
       >
       <el-icon  size="12" ><component :is="item.icon" /></el-icon>
       <router-link class="text flex-box" :to="{path:item.path}">{{item.name}}</router-link>
       <el-icon class="close" size="12" @click="closeTab(item,index)"><Close /></el-icon> 
      </li>
    </ul>
  </div>
   <div class="header-right">
    <el-dropdown @command="handleClick">
      <div class="el-dropdown-link flex-box">
        <el-avatar
        :src="userInfo.avatar"
      />
      <p class="user-name">{{userInfo.name}}</p>
      </div>
      <template #dropdown>
        
          <el-dropdown-item command="cancel">退出登录</el-dropdown-item>
    
    </template>
  </el-dropdown>
   </div>
  </div>
</template>
<script setup>
import { useStore } from 'vuex'
import {computed} from 'vue'
import {useRoute,useRouter} from 'vue-router'
const route = useRoute()
const router = useRouter()
const store = useStore()
const selectMenu = computed(() => store.state.menu.selectMenu)

const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))
//关闭tag
const closeTab = (item,index) => {
  store.commit('closeMenu',item)
  //删除非当前页tag
  if(route.path!==item.path){
    return
  }
   const selectedMenuData = selectMenu.value

  // 已经没有 tag 了
  if (!selectedMenuData.length) {
    router.push('/')
    return
  }

  // 关闭的是最后一个
  if (index >= selectedMenuData.length) {
    router.push({
      path: selectedMenuData[index - 1].path
    })
  } else {
    // 关闭中间项，后面的元素已经补到当前 index
    router.push({
      path: selectedMenuData[index].path
    })
  }
}
const handleClick = (command) => {
    if(command === 'cancel'){
      localStorage.removeItem('pz_token')
      localStorage.removeItem('pz_userInfo')
      localStorage.removeItem('pz_v3pz')
      window.location.href = window.location.origin
    }
  }
</script>

<style lang="less" scoped>
.flex-box{
  display: flex;
  align-items: center;
  height: 100%;
}
.header-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%; 
  background-color:#fff;
  padding-right:25px;
  .header-left{
    height: 100%;
    .icon{
      width: 45px;
      height: 100%;
    }
    .icon:hover{
      background-color: #f5f5f5;
      cursor: pointer;
    }
    .tab{
      padding: 0 10px;
      height: 100%;
      .text{
        margin: 0 5px;
      }
      .close{
        visibility: hidden;
      }
      &.selected{
        a{
          color: #409eff;
        }
        i{
          color: #409eff;
        }
        background-color: #f5f5f5;
      }
    }
    .tab:hover{
      background-color: #f5f5f5;
      .close{
        visibility: inherit;
        color: #000;
        cursor: pointer;
      }
    }
  }
  .header-right{
    .user-name{
      margin-left: 10px;
    }
  }
  a{
    height: 100%;
    color: #333;
    font-size: 15px;
  }
}
</style>

