<template>
  <div class="list-container">
    <!-- 面包屑展示区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图列表展示区域 -->
    <el-card class="box-card" shadow='hover'>
      <!-- 搜素与添加区域 -->
      <el-row :gutter="20" style="margin-bottom:20px">
        <!-- 搜索区域 -->
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.order_id" clearable class="input-with-select"
            @clear="getGoodsList()">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
          </el-input>
        </el-col>
        <!-- 添加区域 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoods()">
            点击添加商品
          </el-button>
        </el-col>
      </el-row>
      <!-- 商品列表展示区域 -->
      <el-table :data="this.goodsList" style="width: 100%" border stripe>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70">
        </el-table-column>
        <el-table-column label="创建时间" width="200">
          <template v-slot="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column width="200">
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" round @click="showEditDialog(scope.row.id)">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" round @click="deleteGoods(scope.row.goods_id)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top:20px">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'List',
    created() {
      this.getGoodsList();
    },
    data() {
      return {


        /* 商品列表 */
        goodsList: [],
        /* 请求信息 */
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10,

        },
        /* 总共的页数 */
        total: 0,
      }
    },
    methods: {
      /*  */

      /* 跳转到添加商品页面 */
      goAddGoods() {
        this.$router.push('/goods/add');
      },
      /* 删除商品 */
      async deleteGoods(id) {
        const confirmResult = await this.$messageBox.confirm('此操作将删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).catch(err => err)
        /* 如果用户取消操作，则返回字符串 cancel
          如果用户确定操作，则返回字符串 confirm
        */
        //如果取消
        if (confirmResult !== 'confirm') {
          return this.$message.info('已撤销删除商品操作')
        }
        //如果确定
        const {
          data: res
        } = await this.$http.delete(`goods/${id}`)
        //如果删除不成功
        if (res.meta.status !== 200) {
          return this.$message.info(res.meta.msg)
        }
        //如果删除成功
        this.$message.success(res.meta.msg)
        //刷新列表
        this.getGoodsList();
      },
      //监听SizeChange
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        //重新获取数据
        this.getGoodsList()

      },
      /* 底部区域页数变换 */
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        //重新获取数据
        this.getGoodsList()
      },
      /* 获取商品列表 */
      async getGoodsList() {
        const {
          data: res
        } = await this.$http.get('goods', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.goodsList = res.data.goods;
        this.total = res.data.total;
      }
    },
  }

</script>

<style lang="less" scoped>
  .list-container {
    width: 100%;
    height: 100%;
  }

</style>
