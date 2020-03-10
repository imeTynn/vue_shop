<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 为echarts准备一个具体宽高的dom -->
            <div id="main" style="width:750px;height:400px;"></div>
        </el-card>
    </div>
</template>
<script>
//1.导入echarts
import echarts from 'echarts'
import _ from 'lodash'
export default {
    data(){
        return{

        }
    },
    //此时页面上的元素被渲染完毕
   async mounted(){
     const {data:res} = await this.$http.get('reports/type/1')
     if(res.meta.status!==200){
         return this.$message.error('获取折现数据失败')
     }
      var myChart = echarts.init(document.getElementById('main'))
        myChart.setOption(res.data)
    }
}
</script>
<style lang="less" scoped>

</style>