<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区 -->
            <el-table :data="rolelist" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bgbottom',n==0?'bgtop':'','vcenter'] " v-for="(item,n) in scope.row.children" :key="item.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                               <el-tag closable  @close="removeRightsById(scope.row,item.id) ">{{item.authName}}</el-tag> 
                               <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二,三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[n===0?'':'bgtop','vcenter']" v-for='(item2,n) in item.children' :key="item2.id">
                                    <!-- 二级权限 -->
                                    <el-col :span="6">
                                        <el-tag type="success" closable  @close="removeRightsById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                        <el-tag closable  @close="removeRightsById(scope.row,item3.id) " type="warning" v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetting(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限的对话框 -->
        <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="30%"
        @close="setRightDialogClosed"
      >
        <!-- 树形控件 -->
        <el-tree ref="treeRef" :default-checked-keys="defkeys" default-expand-all=true node-key="id" show-checkbox :data="rightslist" :props="treeProps" @node-click="handleNodeClick"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        return{
            rolelist:[],  //所有角色的列表
            setRightDialogVisible:false, //控制分配权限对话框的显示
            rightslist:[],
            treeProps:{
                children:'children',
                label:"authName"
            },
            defkeys:[],  //默认选中的节点id值
            roleId:""  //当前即将分配权限的角色id
        }
    },
    methods:{
    //为角色分配权限
    async allotRights(){
       const keys=[
           //拿到选中的节点和半节点
         ...this.$refs.treeRef.getCheckedKeys(),
         ...this.$refs.treeRef.getHalfCheckedKeys()
       ]
       const idStr=keys.join(',')
       const{data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{
           rids:idStr
       })
       if(res.meta.status!==200){
           return this.$message.error('分配权限失败')
       }
       this.$message.success("分配权限成功")
       this.getRolesList()
       this.setRightDialogVisible=false
      console.log(keys)

    },
    //监听分配权限的对话框的关闭
      setRightDialogClosed(){
         this.defkeys=[]
      },
      //通过递归的形式，获取角色所有三级权限的id,并且保存到defkeys中
      getLeafKeys(node,arr){
          //如果当前node节点不包含children树形，则为三级节点
           if(!node.children){
               return arr.push(node.id)
           }

           node.children.forEach(ele => {
               this.getLeafKeys(ele,arr)
           });
      },
      //展示分配权限的对话框
     async showSetting(role){
        this.roleId=role.id
        const{data:res} = await this.$http.get('rights/tree')
        if(res.meta.status!==200){
            return this.$message.error('获取权限数据失败')
        }
          
          this.rightslist=res.data
          console.log(this.rightslist)
          //递归获取三级节点的id
          this.getLeafKeys(role,this.defkeys)
          this.setRightDialogVisible=true
      },
      async getRolesList(role){
          const {data:res}=await this.$http.get('roles')
          if(res.meta.status!==200){
              return this.$message.error('获取角色列表失败')
          }else{
             this.rolelist=res.data 
          }
      },
      //根据id删除对应的权限
      async removeRightsById(rowId,rightid){
           //弹框提示用户是否删除
          const res= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>{
                return err
            })
          if(res!=='confirm'){
              return this.$message.info('取消删除')
          }else{
            const {data:res} = await  this.$http.delete(`roles/${rowId.id}/rights/${rightid}`)
            if(res.meta.status!==200){
                return this.$message.error('删除权限失败')
            }
            //不调用this.getRolesList()因为避免重新刷新自动合起来
            roleId.children=res.data
          }
      }
    },
    created(){
        this.getRolesList()
    }

}
</script>

<style lang="less" scoped>
.el-tag{
    margin:7px;
}
.bgtop{
    border-top:1px solid #eee;
}
.bgbottom{
    border-bottom:1px solid #eee;
}
.vcenter{
    display:flex;
    align-items:center;
}
</style>