<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input>
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 订单列表数据 -->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index" label="#">
                </el-table-column>
                 <el-table-column label="订单编号" prop="order_number">
                </el-table-column>
                <el-table-column label="订单价格" prop="order_price">
                </el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send">
                </el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time|dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showbox(scope.row)"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location" @click="showprogressbox(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 修改地址的对话框 -->
        <el-dialog
            title="修改地址"
            :visible.sync="addressVisible"
            width="50%"
            @close="addressDialogClose"
            >
            <el-form ref="addressFormRef" :model="addressform" :rules="addressformRules" label-width="80px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader :options="cityData" v-model="addressform.address1">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressform.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressVisible= false">取 消</el-button>
                <el-button type="primary" @click="addressVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 展示物流进度的对话框 -->
        <el-dialog
            title="物流进度"
            :visible.sync="progressVisible"
            width="50%"
            >
            <!-- 时间线 -->
            <el-timeline>
                <el-timeline-item
                v-for="(activity, index) in progressInfo"
                :key="index"
                :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>

    </div>
</template>

<script>
import cityData from './citydata'
export default {
    data(){
        return{
           progressVisible:false,
           addressform:{
               address1:[],
               address2:""
           } ,
           addressformRules:{
               address1:[
                    { required: true, message: '请输入省市区/县', trigger: 'blur' }
               ],
               address2:[
                    { required: true, message: '请填写详细地址', trigger: 'blur' }
               ]
           },
           cityData,  //级联选择器中的数据
           addressVisible:false, //修改地址
           queryInfo:{
               query:'',
               pagenum:1,
               pagesize:10
           },
           total:0,   //订单总数
           orderList:[],  //订单列表
           progressInfo:[]
        }
    },
    created(){
       this.getOrderList()
    },
    methods:{
    //显示进度
   async showprogressbox(obj){
    const {data:res} = await this.$http.get('/kuaidi/804909574412544580')
     if(res.meta.status!==200){
         return this.$message.error('获取物流进度失败')
     }
     this.progressInfo=res.data
     this.progressVisible=true
    },
        //关闭对话框清空表单
    addressDialogClose(){ 
        this.$refs.addressFormRef.resetFields()
    },
    //展示修改地址的对话框
    showbox(obj){
        this.addressVisible=true

    },
    //页数发生改变
      handleSizeChange(newsize){
         this.queryInfo.pagesize=newsize
         this.getOrderList()
      },
      handleCurrentChange(newpage){
         this.queryInfo.pagenum=newpage
         this.getOrderList()
      },
    //页码发生改变
      async  getOrderList(){
         const {data:res}  = await this.$http.get('orders',{params:this.queryInfo})
           if(res.meta.status!==200){
               console.log(res)
               return this.$message.error('获取订单列表失败')
           }
           this.total=res.data.total
           this.orderList=res.data.goods
           console.log(res)
        }
    }
}
</script>
<style lang="">
.el-cascader{
    width:100%;
} 
</style>