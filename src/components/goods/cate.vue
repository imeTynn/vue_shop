<template>
    <div>
          <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button @click="showAddCateDialog" type="primary">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
             <tree-table class="tree-table" :data="catelist" 
              :columns="columns"    
              :selection-type="false" 
              :expand-type="false"
              show-index
              index-text="#"
              border 
              :show-row-hover="false"
               >
                 <!-- 是否有效 -->
                 <template slot="isok" slot-scope="scope">
                      <i style="color:lightgreen" v-if="scope.row.cat_deleted===false" class="el-icon-success"></i>
                      <i style="color:lightgreen" v-else class="el-icon-error"></i>
                 </template>
                 <!-- 排序 -->
                 <template slot="order" slot-scope="scope">
                     <el-tag v-if="scope.row.cat_level==0" size="mini">一级</el-tag>
                     <el-tag v-else-if="scope.row.cat_level==1" size="mini" type="success">二级</el-tag>
                     <el-tag v-else size="mini" type="warning">三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                    
                </template>
             </tree-table>
            <!-- 分页区 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
             </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCatedialogVisible"
            width="50%"
           >
           <!-- 添加商品 -->
           <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:" >
                    <!-- option用来指定数据源,props用来指定配置对象 -->
                      <el-cascader
                        v-model="selectedKeys"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="parentCateChange"
                        :change-on-select="true"
                        clearable>
                      </el-cascader>
                </el-form-item>
           </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCatedialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            cascaderProps:{
                value:'cat_id',  //拿到的属性
                label:"cat_name", //显示的值
                children:'children' //指定父子嵌套的属性
            },
            selectedKeys:[], //级联选择器选中的
            //父级分类
            parentCateList:[],
            addCateForm:{
                cat_name:"",
                cat_pid:0, //父级分类的id
                cat_level:0  //默认添加的分类为一级分类
            },
            //添加分类的校验规则
            addCateFormRules:{
                 cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                 ]
            },
            addCatedialogVisible:false, //控制添加分类框的显示和隐藏
            catelist:[],
            //查询条件
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            //总数据条数
            total:0,
            columns:[
                {
                  label:'分类名称',
                  prop:'cat_name'
                },{
                   label:"是否有效",
                   prop:"",
                   type:'template',//定义当前列为模板列
                   template:'isok'  //表示当前这一列使用模板名称

                },
                {
                    label:'排序',
                    type:'template',
                    template:'order'
                },
                {
                    label:'操作',
                    type:'template',
                    template:'opt'
                }
            ]
        }
    },
    methods:{
        addCate(){
            
        },
        //级联选中起选中项发生改变
        parentCateChange(){
            //选中的父级分类，永远都是最后一项的id
            if(this.selectedKeys.length>0){
              this.addCateForm.cat_level=this.selectedKeys.length 
              this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
              return
            }else{
                this.addCateForm.cat_level=0
                this.addCateForm.cat_pid=0
            }
        },
        //获取父级分类的数据列表
        async getParentCateList(){
          const{data:res} = await this.$http.get('categories',{params:{type:2}})
        if(res.meta.status!==200){
            this.$message.error('调用父级分类列表失败')
          }
          this.parentCateList=res.data
        },
        //点击按钮显示分类的对话框
        showAddCateDialog(){
            //打开对话框时获取父级分类列表
            this.getParentCateList()
            this.addCatedialogVisible=true
        },
        //监听pagesize的改变
        handleSizeChange(newsize){
            this.queryInfo.pagesize=newsize
            this.getCateList()
        },
        // 监听pagenum的改变
        handleCurrentChange(newpage){
           this.queryInfo.pagenum=newpage
           this.getCateList()
        },
        //获取商品分类
        async getCateList(){
          const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
          if(res.meta.status!==200){
              return this.$message.error('获取商品分类失败')
          }
          //把数据列表赋值给catelist
          this.catelist=res.data.result
          //为总数条数赋值
          this.total=res.data.total
        }
    },
    created(){
       this.getCateList()
    }
}
</script>

<style lang="less" scoped>
.tree-table{
    margin-top:15px;
}
</style>