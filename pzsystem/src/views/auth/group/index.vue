<template>
  <PanelHead :route="route" />
  <div class="btns">
    <el-button type="primary" :icon="Plus" @click="open(null)" size="small">新增</el-button>
  </div>
   <el-table :data="tableData.list" width="100%">
    <el-table-column prop="id" label="id"  />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissionName" label="菜单权限" width="500px" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
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
     :before-close="beforeClose"
     title="添加权限"
     width="500px"
>
    <el-form
    ref="formRef"
    label-width="100px"
    label-position="left"
    :model="form"
    :rules="rules"
    >
    <el-form-item v-show="false" prop="id">
    <el-input v-model="form.id" placeholder="请输入权限ID" /> 
    </el-form-item>
      <el-form-item label="名称" prop="authName">
        <el-input v-model="form.authName" placeholder="请输入权限名称"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
        ref="treeRef"
        style="max-width: 600px;"
          :data="permissionData"
          node-key="id"
          show-checkbox
          :default-checked-keys="defaultKeys"
          :default-expanded-keys="[2]"
           :props="defaultProps"
        />
      </el-form-item>
         </el-form>   
         <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="confirm(formRef)">确认</el-button>
          </div>
         </template>
</el-dialog>

</template>

<script setup>
import { ref,reactive,onMounted ,nextTick} from 'vue'
import { userGetMenu,userSetMenu ,menuList} from '../../../api'
import { Plus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
const route = useRoute()
onMounted(()=>{
  getListData()
  userGetMenu().then(({data})=>{
  //  console.log(data)
   permissionData.value = data.data
  })
})
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
})

//分页
const handleSizeChange = (val) => {
  paginationData.pageSize = val
  getListData()
}
const handleCurrentChange = (val) => {
  paginationData.pageNum = val
  getListData()
}
//表格数据
const tableData = reactive({
  list:[],
  total:0
})
//打开编辑弹窗
const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  nextTick(() => {
    // 如果是编辑
    if(rowData) {
      Object.assign(form, { id: rowData.id, authName: rowData.name })
      treeRef.value.setCheckedKeys(rowData.permission)
    }
  })
}
//请求列表数据
const getListData=()=>{
  menuList(paginationData).then(({data})=>{
    const {list,total} = data.data
    tableData.list = list
    tableData.total = total
  })
}
const formRef = ref()
//form表单数据
const form=reactive({
  name:'',
  id:'',
})
//树形结构的权限数据
const permissionData = ref([])
//弹窗的显示与隐藏
const dialogFormVisible = ref(false)
//关闭弹窗的回调
const beforeClose = () => {
  formRef.value.resetFields()
  treeRef.value.setCheckedKeys(defaultKeys)
   dialogFormVisible.value = false
}
//选中权限
const defaultKeys = [4,5]
const treeRef = ref()
const rules = reactive({
  authName: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
})
//表单提交
const confirm=async(formEl)=>{
   if (!formEl) return
    await formEl.validate((valid, fields)=>{
    if(valid){
      //获取到选中的checkbox数据
     const name = form.authName
      const id = form.id
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
      userSetMenu({name,permissions,id}).then(({data})=>{
        // console.log(data)
    beforeClose()
    getListData()
      })
    }else{
       console.log('error submit!', fields)

    }
    })
}
</script>

<style lang="less" scoped>
.btns{
  padding: 0 10px 10px 0;
  background-color: #fff;
}
</style>