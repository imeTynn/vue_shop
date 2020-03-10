<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 提示区 -->
             <el-alert title="添加商品信息" type="info" center show-icon :closable="false" >
            </el-alert>
             <!-- 步骤条 -->
             <el-steps align-center :space="200" :active="activeIndex-0" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- tab栏区域 -->
            <el-form :model="addForm"  label-position="top"  :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-tabs @tab-click="tabClick" v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"> </el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"> </el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"> </el-input>
                        </el-form-item> 
                        <el-form-item label="商品重量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"> </el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                             <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateList"
                                :props="cateProps"
                                @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
                             <!-- 复选框组 -->
                             <el-checkbox-group v-model="item.attr_vals">
                                 <el-checkbox border v-for="(item,i) in item.attr_vals" :key="i" :label="item"></el-checkbox>
                             </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                       
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
           onlyTableData:[],//静态属性列表数组
           manyTableData:{},//动态参数列表
           cateProps:{
              label:'cat_name',
              value:'cat_id',
              chidlren:'children'
           },
           cateList:[], //商品分类列表
           activeIndex:0,
           addForm:{
               goods_name:'',
               goods_price:0,
               goods_weight:0,
               goods_number:0,
               goods_cat:[]
           },  //添加商品的表单项
           addFormRules:{
               goods_name:[
                   { required: true, message: '请输入商品名称', trigger: 'blur' }
               ],
               goods_price:[
                   { required: true, message: '请输入商品价格', trigger: 'blur' }
               ],
               goods_weight:[
                  { required: true, message: '请输入商品重量', trigger: 'blur' }
               ],
               goods_number:[
                  { required: true, message: '请输入商品数量', trigger: 'blur' }
               ],
               goods_cat:[
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
               ]
           }
        }
    },
    methods:{
        //标签页切换
        async tabClick(){
            //访问的是动态参数面板
           if(this.activeIndex==='1'){
             const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                   params:{sel:'many'}
               })
              if(res.meta.status!==200){
                  return this.$message.error('获取动态参数列表失败')
              }
              res.data.forEach(item=>{
               item.attr_vals= item.attr_vals.length===0 ?[] : item.attr_vals.split(' ')
              })
              this.manyTableData=res.data
           }else if(this.activeIndex==='2'){
               const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                   params:{sel:'only'}
               })
              if(res.meta.status!==200){
                  return this.$message.error('获取静态属性失败')
              }
              this.onlyTableData=res.data
           }
           
        },
        beforeTabLeave(activeName,oldActiveName){
            console.log(this.addForm.goods_cat.length)
             if( oldActiveName==='0'&&this.addForm.goods_cat.length!==3){
                 this.$message.error('请先选中商品分类')
                 return false
             }
        },
        //级联选择器变化会促发的函数
        handleChange(){
            //控制级联选择器只能选中第三层的数据
            if(this.addForm.goods_cat.length!==3){
                this.addForm.goods_cat=[]
            }
            
        },
        //获取所有的商品分类
       async getCateList(){
         const {data:res} = await this.$http.get('categories')
         if(res.meta.status!==200){
             return this.$message.error('获取商品分类失败')
         }
         this.cateList=res.data
        }
    },
    computed:{
       cateId(){
           if(this.addForm.goods_cat.length===3){
               return this.addForm.goods_cat[2]
           }
           return null
       }
    },
    created(){
        this.getCateList()
    }
}
</script>
<style lang="less" scoped>
.el-checkbox{
    margin:0 10px 0 0 !important;
}
</style>