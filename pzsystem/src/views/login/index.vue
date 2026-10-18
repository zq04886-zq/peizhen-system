<template>
    <el-row class="login-container" justify="center" align="middle">
      <el-card style="width: 430px;max-width: 480px;">
        <template #header>
          <div class="card-header">
          <img :src="imgUrl" alt="">
          </div>
        </template>
        <div class="jump-link">
          <el-link type="primary" @click="handleChange">{{ formType?'返回登录':'注册账号' }}</el-link>
        </div>
        <el-form :model="loginForm" style="max-width: 600px"
        ref="loginFormRef"
        class="demo-ruleForm"
      :rules="rules">
         <el-form-item prop="userName">
               <el-input v-model="loginForm.userName" placeholder="手机号" prefix-icon="UserFilled">       
               </el-input>
         </el-form-item>
         <el-form-item prop="passWord">
               <el-input v-model="loginForm.passWord" placeholder="密码" prefix-icon="Lock">       
               </el-input>
         </el-form-item>
         <el-form-item v-if="formType" prop="validCode">
               <el-input v-model="loginForm.validCode" placeholder="验证码" prefix-icon="Lock">
                 <template #append>
                 <span @click="countDownChange">{{ countDown.validText }}</span>
                 </template> 
               </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :style="{width:'100%'}" @click="submitForm(loginFormRef)">{{ formType?'注册账号':'登录' }}</el-button>
              </el-form-item>
        </el-form>
      </el-card>
    </el-row>
</template>
<script setup>
import {reactive, ref,computed,toRaw} from 'vue'
import { getCode,userAuthentication,login } from '../../api'
import { UserFilled, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { menuPermissions } from '../../api'
const router = useRouter()
const store = useStore()

const imgUrl = new URL('../../../public/login-medical-care.png', import.meta.url).href
//表单数据
  const loginForm = reactive({
  userName: '',
  passWord: '',
  validCode: ''
})
// 登录注册切换(0:登录,1:注册)
const formType = ref(0)
//账号校验
const validateUser = (rule,value,callback) => {
  //不能为空
  if(value===''){
     callback(new Error('请输入账号'))
  }else{
     const phoneReg=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
     phoneReg.test(value)?callback():callback(new Error('请输入正确的手机号'))
  }
}
//密码校验
const validatePassWord = (rule,value,callback) => {
  //不能为空
  if(value===''){
     callback(new Error('请输入密码'))
  }else{
    const reg=/^[a-zA-Z0-9_-]{4,16}$/
    reg.test(value)?callback():callback(new Error('密码只能包含字母、数字、下划线和短横线，且长度在4-16之间'))
  }
}
// 表单校验规则
const rules=reactive({
  userName:[{validator:validateUser,trigger:'blur'}],
  passWord:[{validator:validatePassWord,trigger:'blur'}],
})

// 切换登录注册
const handleChange = () => {
  formType.value = formType.value?0:1
}
// 验证码倒计时
 const countDown =  reactive({
  validText:'获取验证码',
  time:60
})
let flag = false
// 验证码倒计时
const countDownChange = () => {
  if(flag){
    return
  }
  //判断手机号是否为正确
  const phoneReg=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  if(!loginForm.userName||!phoneReg.test(loginForm.userName)){
    return ElMessage({
    message: '请检查手机号是否正确！',
    type: 'warning',
  })
  }
  const timer = setInterval(() => {
    if(countDown.time<=0){
      countDown.validText = '获取验证码'
      countDown.time = 60
      flag = false
      clearInterval(timer)
    }else{
    countDown.time--
    countDown.validText = `剩余${countDown.time}秒`}
  },1000)
  flag = true
  getCode({
    tel: loginForm.userName,
  }).then(({data})=>{
    // console.log(data)
    if(data.code === 10000){
      ElMessage.success('验证码发送成功！')
    }
  })
}
const loginFormRef = ref()
// 提交表单
const submitForm = async (formEl) => {
  if (!formEl) return
  //手动触发校验
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log(loginForm,'submit success!')
      //注册页面
      if(formType.value){
        userAuthentication(loginForm).then(({data})=>{
          if(data.code === 10000){
            ElMessage.success('注册成功！')
            formType.value = 0       
          }
        })
      }else {
      // console.log('error submit!', fields)
      const routerList = computed(()=>{
   return store.state.menu.routerList
})
      //登录页面
      login(loginForm).then(({data})=>{
        if(data.code === 10000){
          ElMessage.success('登录成功！')
          //将token存储到localStorage
          localStorage.setItem('pz_token',data.data.token)
          localStorage.setItem('pz_userInfo',JSON.stringify(data.data.userInfo))
          menuPermissions().then(({data})=>{
            // console.log(data)
            store.commit('dynamicMenu',data.data)
          //  console.log(routerList)
               toRaw(routerList.value).forEach(item => {
               router.addRoute('main',item)
               })
             router.push('/')
        
          })
         
        }})
    } }
})}
</script>
<style lang="less" scoped>
  :deep(.el-card__header) {
    padding: 0
  }
  .login-container {
    height: 100%;
    .card-header{
      background-color: #899fe1;
      img {
        width: 100%;
        height: 220px;
    object-fit: contain;
      }
    }
    .jump-link {
      text-align: right;
      margin-bottom: 10px;
    }
  }
</style>