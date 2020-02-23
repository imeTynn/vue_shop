<template>
    <el-container class="home-container">
            <!-- 头部区域 -->
            <el-header >
                <div>
                    <img src="../assets/heima.png" alt="">
                    <span>电商后台管理系统</span>
                </div>
                <el-button type="info" @click="logout">退出</el-button>
            </el-header>
           <!-- 页面主体区域 -->
            <el-container>
                <!-- 侧边栏 -->
                <el-aside :width="sideWidth">
                    <div class="toggle-button" @click="toggleCollapse">
                        |||
                    </div>
                    <!-- 侧边栏菜单区 -->
                    <el-menu :default-active="activePath" :collapse-transition="false" :collapse="isCollapse" text-color="#fff" :unique-opened="true" background-color="#333744" router>

                        <el-submenu active-text-color="#409eff"   v-for="item in menulist" :key="item.id" :index="item.id+''">
                            <template slot="title">
                                <!-- 一级菜单的图标 -->
                                 <i :class="iconsObj[item.id]"></i>
                                 <!-- 一级菜单的文本 -->
                                 <span>{{item.authName}}</span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item @click="saveNavState('/'+child.path)"  v-for="child in item.children" :key="child.id" :index="'/'+child.path">
                                <!-- 二级菜单的图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 二级菜单的文本 -->
                                <span slot="title">{{child.authName}}</span>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!-- 右侧内容主题 -->
                <el-main>
                    <!-- 路由占位符 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
</template>

<script>
export default {
    data(){
        return{
            menulist:[],
            iconsObj:{
               '125':"iconfont icon-user",
               '103':"iconfont icon-tijikongjian",
               '101':"iconfont icon-shangpin",
               '102':"iconfont icon-danju",
               '145':"iconfont icon-baobiao"
           },
           isCollapse:false,
           sideWidth:'200px',
           activePath:''   //被点击时复活的链接地址
        }
    },
    methods:{
        //保存链接的激活状态
        saveNavState(activePath){
           window.sessionStorage.setItem('activePath',activePath)
           this.activePath=activePath
        },
        //点击按钮切换菜单的折叠和展开
        toggleCollapse(){
             this.isCollapse=!this.isCollapse
             if(this.isCollapse){
                 this.sideWidth='64px'
             }else{
                 this.sideWidth='200px'
             }
        },
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        //获取所有的菜单
       async getMenuList(){
          const {data:res}=await this.$http.get('menus')
          if(res.meta.status!==200){
              return this.$message.error(res.meta.msg)
          }else{
             this.menulist=res.data 
          }
        }
    },
    created(){
        this.getMenuList()
        this.activePath=window.sessionStorage.getItem('activePath')
    }
}
</script>

<style lang="less" scoped>
.home-container{
    height:100% !important;
}
.el-header{
    display:flex;
    justify-content:space-between;
    background-color:#373d41;
    padding-left:0;
    align-items:center;
    color:#fff;
    font-size:20px;
    >div{
        display:flex;
        align-items:center;
        span{
            margin-left:15px;
        }
    }
}
.el-aside{
    background-color:#333744;
    .el-menu{
        border-right:0;
    }
}
.el-main{
    background-color:#eaedf1;
}
.icon-font{
    margin-right:10px;
}
.toggle-button{
    background-color:#4a5064;
    text-align:center;
    color:#fff;
    font-size:10px;
    line-height:24px;
    letter-spacing: 0.2em;
    cursor:pointer;
}
</style>