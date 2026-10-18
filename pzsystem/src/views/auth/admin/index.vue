<script setup>
import dayjs from 'dayjs'
import { authAdmin, menuSelectList ,updateUser} from '../../../api'
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
// console.log(route)

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
})
onMounted(() => {
  getListData()
  menuSelectList().then(({data})=>{
    // console.log(data)
    options.value = data.data
  })
})
let options = ref([])
//表格数据
const tableData = reactive({
  list:[],
  total:0
})
//根据权限id匹配权限名称
const permissionName = (permissions_id) => {
   const data = options.value.find(el => el.id === permissions_id)
   return data?data.name : '超级管理员'
   
}
//请求列表
const getListData = () => {
  authAdmin(paginationData).then(({data})=>{
    // console.log(data)
    const{list,total} = data.data
    list.forEach(item => {
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
    })
    tableData.list = list
    tableData.total = total})
}
//分页
const handleSizeChange = (val) => {
  paginationData.pageSize = val
  getListData()
}
const handleCurrentChange = (val) => {
  paginationData.pageNum = val
  getListData()
}
const handleEdit = (rowData) => {
  dialogFormVisible.value = true
   form.value = JSON.parse(JSON.stringify(rowData))
}
const rules = ref({
  name:[{required:true,message:'请输入昵称',trigger:'blur'}],
  permissions_id:[{required:true,message:'请选择菜单权限',trigger:'blur'}],
})
//弹窗
const dialogFormVisible = ref(false)
const beforeClose = () => {
 dialogFormVisible.value = false
}
//编辑表单
const form = reactive({
  name:'',
  permissions_id:'',
})
//确认提交
const confirm = async (formEl) => {
  if(!formEl){
    return
  }
  await formEl.validate((valid,fields)=>{
    if(valid){
      const {name,permissions_id} = form.value
      updateUser({name,permissions_id}).then(({})=>{
          dialogFormVisible.value = false
          getListData()
      })
    }else{
      console.log('error submit',fields)
    }
  })
  const formRef = ref()
}
</script>

<template>
  <PanelHead :route="route" />
  <el-table :data="tableData.list" width="100%">
    <el-table-column prop="id" label="id"  />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissions_id" label="所属组别" >
      <template #default="scope">
        {{permissionName(scope.row.permissions_id)}}
      </template>
   </el-table-column>
    <el-table-column prop="mobile" label="手机号" />

    <el-table-column prop="active" label="状态" >
      <template #default="scope">
       <el-tag :type="scope.row.active ? 'success' : 'danger'">{{scope.row.active ? '正常' : '失效'}}</el-tag>
      </template>
   </el-table-column>

   <el-table-column label="创建时间" >
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
       <span style="margin-left: 10px;">{{scope.row.create_time}}</span>
        </div>
      </template>
   </el-table-column>

    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="danger">删除</el-button>
      </template>
    </el-table-column>
   </el-table>
   <div class="pagination-info">
    <el-pagination
      v-model:currentPage="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :background="false"
      size="small"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
   </div>
   <el-dialog
     v-model="dialogFormVisible"
     title="添加权限"
     width="500px"
>
      <el-form 
      label-width="100px"
    label-position="left"
    :model="form"
    :rules="rules">
   <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" ></el-input>
        </el-form-item>
         <el-form-item label="菜单权限" prop="permissions_id">
         <el-select
          v-model="form.permissions_id"
          placeholder="请选择菜单权限"
          style="width: 240px;"
          :options="options"
          >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
         </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="confirm(formRef)">确认</el-button>
          </div>
         </template>
</el-dialog>
</template>

<style lang="less" scoped>
.flex-box{
  display: flex;
  align-items: center;
}
</style>