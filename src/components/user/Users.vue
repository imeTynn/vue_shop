<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加 --> 
               <el-row :gutter="20">
                   <el-col :span="7">
                       <el-input @clear="getUserList" clearable placeholder="请输入内容" v-model="queryInfo.query"> 
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                       </el-input>
                    </el-col>
                    <el-col :span="4">
                         <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                    </el-col>
               </el-row>
            
            <!-- 用户列表展示 -->
            <el-table border stripe
                :data="userlist"
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="#"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="姓名"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="邮箱"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="电话">
                </el-table-column>
                <el-table-column
                    prop="role_name"
                    label="角色">
                </el-table-column>
                <el-table-column
                    label="状态"
                    prop="mg_state"
                    >
                    <template slot-scope="scope">
                        <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column width="200px"
                    label="操作">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button  size="mini" type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
                         <!-- 分配角色按钮 -->
                         <el-tooltip class="item" effect="dark" content="分配角色" :enterable="false" placement="top">
                             <el-button @click="setRole(scope.row)" size="mini" type="warning" icon="el-icon-setting"></el-button>
                         </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
           
            <!-- 分页展示 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

            <!-- 添加用户的对话框 -->
            <el-dialog @close="addDialogClosed"
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="50%">
                <!-- 内容主体区域 -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 对话框底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>


            <!-- 编辑用户的对话框 -->
            <el-dialog
                title="修改用户"
                :visible.sync="editDialogVisible"
                width="50%" @close="editDialogClosed">
                 <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                   <el-form-item label="邮箱">
                        <el-input v-model="editForm.email" ></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="editForm.mobile" ></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editDialog">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 分配角色的对话框 -->
            <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialogVisible"
            width="50%"
            @close="setRoleDialogClosed"
            >
           <div>
               <p>当前的用户:{{userinfo.username}}</p>
               <p>当前的角色:{{userinfo.role_name}}</p>
               <p>分配角色:
                   <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                        v-for="item in rolesList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
               </p>
           </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        //校验邮箱
          var checkeEmail=(rule,value,callback)=>{
              //验证邮箱的正则
               const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
                if(regEmail.test(value)){
                    return callback()
                }
                callback(new Error('请输入合法的邮箱'))
          } 
          //校验手机号
         var checkeMobile=(rule,value,callback)=>{
              const regMobile=/^1[3456789]\d{9}$/
              if(regMobile.test(value)){
                  return callback()
              }
              callback(new Error('请输入合法的电话号码'))
          }
        return{
          selectedRoleId:"", //已经选中的角色id值
          //控制分配角色对话框的显示和隐藏
         setRoleDialogVisible:false,
          addForm:{
              username:"",
              password:"",
              email:"",
              mobile:""

          } ,//添加用户的表单数据
          addFormRules:{
              username:[
                  { required: true, message: '请输入用户名', trigger: 'blur' },
                  { min:3,max:10,message:"用户名的长度在3到10之间",trigger:'blur'}
              ],
              password:[
                  { required: true, message: '请输入密码', trigger: 'blur' },
                  { min:6,max:15,message:"密码的长度在6到15之间",trigger:'blur'}
              ],
              email:[
                  { required: true, message: '请输入邮箱', trigger: 'blur' },
                  { validator:checkeEmail, trigger: 'blur' }
              ],
              mobile:[
                  { required: true, message: '请输入手机号', trigger: 'blur' },
                  { validator:checkeMobile, trigger: 'blur' }
              ]
          },//添加用户的表单的验证
          queryInfo:{
              query:"",
              pagenum:1,  //当前页码
              pagesize:2   //当前页数
          },
          userlist:[], 
          editForm:{//编辑时查询到的用户信息对象
              username:"",
              email:"",
              mobile:""
          },
          editFormRules:{
             email:[
                 { required: true, message: '请输入邮箱', trigger: 'blur' },
                  { validator:checkeEmail, trigger: 'blur' }
             ],
             mobile:[
                 { required: true, message: '请输入邮箱', trigger: 'blur' },
                 { validator:checkeMobile, trigger: 'blur' }
             ]
          },
          total:0,
          addDialogVisible:false, //添加用户对话框的显示和隐藏
          editDialogVisible:false , //编辑用户对话框的显示和隐藏
          userinfo:{},  //需要被分配角色的用户信息
          rolesList:[]   //所有角色的数据列表
        }
    },
    methods:{
        //监听用户关闭对话框
        setRoleDialogClosed(){
           this.userinfo={}
           this.selectedRoleId=""
        },
        //保存用户的分配
       async saveRoleInfo(){
           if(!this.selectedRoleId){
               return this.$message.error('用户角色不能为空')
           }
            const{data:res}=await this.$http.put(`users/${this.userinfo.id}/role`,{
                rid:this.selectedRoleId
            })
            console.log(res)
            if(res.meta.status!==200){
                return this.$message.error('更新角色失败')
            } 
            this.$message.success('更新角色成功')
            this.getUserList()
            this.setRoleDialogVisible=false
        },
        //分配角色
       async setRole(role){
           this.userinfo=role
           this.setRoleDialogVisible=true
           //获取所有的角色列表
          const {data:res}=await this.$http.get('roles')
          if(res.meta.status!==200){
              return this.$message.error('获取角色列表失败')
          }

          this.rolesList=res.data

        },
        //删除事件
        async removeUserById(id){
          const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err=>{
                   return err 
                })
                if(confirmResult!=='confirm'){
                    return this.$message.info('取消删除')
                }else{
                   const {data:res}= await this.$http.delete('/users/'+id)
                   if(res.meta.status!==200){
                       return this.$message.error('删除失败')
                   }else{
                       this.$message.success('删除用户成功')
                       this.getUserList()
                   }
                }
                //如果用户确认，则会confirmResult返回confirm字符串
                //，如果用户取消，则报错需要catch捕获错误，返回cancel
        },
        //编辑事件
       async editDialog(){
            //表单的预验证
            this.$refs.editFormRef.validate(async valid=>{
                 if(!valid) return this.$message.error('编辑用户失败')
                 //发起修改用户信息的请求
                 const {data:res}=await this.$http.put('/users/'+this.editForm.id,{
                     email:this.editForm.email,
                     mobile:this.editform.mobile
                 })
                 if(res.meta.status!==200){
                     return this.$message.error('更新用户信息失败')
                 }else{
                     //关闭对话框
                     this.editDialogVisible=false
                     //刷新数据列表
                     this.getUserList()
                     //提示修改成功
                     this.$message.success('更新用户信息成功')
                 }
                 this.$message.success('编辑用户成功')
                 console.log(this.editForm)
            })
        },
        //监听修改用户对话框的事件
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
        },
        // 编辑用户事件
       async showEditDialog(id){
           
            const {data:res}=await this.$http.get('/users/'+id)
            if(res.meta.status!==200){
               return this.$message.error('查询用户信息失败')
            }else{
                this.editForm=res.data
            }
             this.editDialogVisible=true
        },
        //监听添加用户的事件,做预校验
        addUser(){
            this.$refs.addFormRef.validate(async (valid,val)=>{
                 if(!valid) return 
                 //可用发起添加用户的网络请求
                const {data:res}= this.$http.post('/users',this.addForm)
                if(res.meta.status!==201){
                    this.$message.error('添加用户失败')
                }else{
                    this.$message.success("添加用户成功")
                    this.addDialogVisible=false
                    //重新获取用户列表数据
                    this.getUserList()
                }
                console.log(res)
            })
        },
        //监听用户对话框的关闭事件
        addDialogClosed(){
               this.$refs.addFormRef.resetFields()
        },
        //监听用户状态的改变
        async userStateChange(val){
            const {data:res}= await this.$http.put(`users/${val.id}/state/${val.mg_state}`)
           if(res.meta.status!==200){
               return this.$message.error('更新用户状态失败')
               //更新失败则把页面上的状态改变成原来的状态
               val.mg_state=!val.mg_state;
           }else{
               return this.$message.success('更新用户状态成功')
           }
        },
        //监听pagesize改变
      handleSizeChange(newSize){
          this.queryInfo.pagesize=newSize;
          this.getUserList()
      },
      //监听pagenum改变
      handleCurrentChange(newNum){
          this.queryInfo.pagenum=newNum;
          this.getUserList()
      },
      async getUserList(){
          const {data:res}=await this.$http.get('/users',{params:this.queryInfo})
          if(res.meta.status!==200) return this.$message.error('获取用户列表失败')
          this.userlist=res.data.users
          this.total=res.data.total
          console.log(res)
       }
    },
    created(){
        this.getUserList()
    }
}
</script>

<style lang="less" scoped>

</style>