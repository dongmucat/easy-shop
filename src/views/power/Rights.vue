<template>
  <div class="rights-container">
      <!-- 面包屑展示区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图权限列表展示区域 -->
    <!-- 注意此处要data动态绑定 rightsList -->
    <el-card class="box-card" shadow='hover'>
        <el-table
        :data="rightsList"
        border
        stripe
        style="margin-bottom:20px"
      >
      <!-- 第一列 :序号-->
        <el-table-column type="index">
        </el-table-column>
       <!-- 第二列:权限名称 -->
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <!-- 第三列:路径 -->
        <el-table-column prop="path"  label="路径">
        </el-table-column>
        <!-- 第四列:权限等级 -->
        <el-table-column label="权限等级">
            <!-- 作用域插槽:存放等级tag -->
            <template v-slot="scope">
                <!-- 使用v-if条件渲染 -->
                <el-tag v-if="scope.row.level === '0'">等级一</el-tag>
                <el-tag type="success" v-if="scope.row.level === '1'">等级二</el-tag>
                <el-tag type="warning"  v-if="scope.row.level === '2'">等级三</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    name:'Rights',
    created(){
        /* 获取权限列表 */
        this.getRightsList()
    },
    data() {
        return {
            /* 权限列表 */
            rightsList:[]
        }
    },
    methods: {
        async getRightsList(){
            /* 发起获取权限列表的请求 */
            const {data : res}  = await this.$http.get('rights/list')
            /* 判断是否请求成功 */
            /* 如果失败 */
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            /* 如果成功 */
            this.rightsList = res.data
            
        }
    },
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.rights-container{
    width: 80%;
    height: 100%;
}
</style>