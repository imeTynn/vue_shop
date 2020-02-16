<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
             <div class="avatar_box">
                 <img src="../assets/logo.png">
             </div>
            <!-- 登陆表单区域 -->
            <el-form ref="loginFormRef" :model='loginForm' label-width="0px" class="login_form" :rules="loginFormRuls">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <!-- 按钮区 -->
                <el-form-item class="btns">
                     <el-button type="primary" @click="login">登陆</el-button>
                      <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
          loginForm:{
             username:"admin",
             password:"123456"
          },
        //   表单验证对象
          loginFormRuls:{
            //   验证用户名
              username:[
                  { required: true, message: '请输入登陆名称', trigger: 'blur' },
                  { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
              ],
              password:[
                  { required: true, message: '请输入登陆密码', trigger: 'blur' },
                  { min: 6, max: 15, message: '长度在 6到 15个字符', trigger: 'blur' }
              ]
          }
        }
    },
    methods:{
         resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
         },
         login(){
             this.$refs.loginFormRef.validate(async (valid,val)=>{
                 if(!valid){
                     return
                 }else{
                    const {data:res}=await this.$http.post('login',this.loginForm)
                    if(res.meta.status!==200){
                        return this.$message.error('登陆失败')
                    }else{
                        //登陆成功之后的token保存到客户端的sessionStorage中
                        //    项目中除了登陆之外的api接口必须登陆成功后使用
                        //token只在打开网页期间起效，所以保存在sessionStorage中
                        //登陆成功通过编程式导航跳转到主页，路由为/home
                        console.log(res)
                        this.$message.success('登陆成功')
                        window.sessionStorage.setItem('token',res.data.token)
                        this.$router.push("/home")
                    }
                 }
             })
         }
    }
}
</script>

<style lang="less" scoped>
.login_container{
    background-color:#2b4b6b;
    height:100%;
}
.login_box{
    width:450px;
    height:300px;
    background-color:#fff;
    border-radius:3px;
    position:absolute;
    left:50%;
    top:50%;
    // 使盒子居中，也可以用margin-top等于高度的一半，margin-left等于宽度的一半
    transform:translate(-50%,-50%);
}
.avatar_box{
    height:130px;
    width:130px;
    border:1px solid #eee;
    border-radius:50%;
    padding:10px;
    box-shadow:0 0 10px #ddd;
    position:absolute;
    background-color:#fff;
     left:50%;
    transform:translate(-50%,-50%);
    img{
        width:100%;
        height:100%;
        border-radius:50%;
        background-color:#eee;
    }
}
.login_form{
    position:absolute;
    bottom:0;
    width:100%;
    padding:0 20px;
    box-sizing:border-box;
}
.btns{
    display:flex;
    justify-content:flex-end;
}
</style>