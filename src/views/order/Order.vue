<template>
  <div class="order-container">
    <!-- 面包屑展示区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图列表展示区域 -->
    <el-card class="box-card" shadow='hover'>
      <!-- 搜素与添加区域 -->
      <el-row :gutter="20" style="margin-bottom:20px">
        <!-- 搜索区域 -->
        <el-col :span="7">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" class="input-with-select"
            @clear="getOrderList()">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表展示区域 -->
      <el-table :data="this.orderList" style="width: 100%" border stripe>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80">
        </el-table-column>
        <el-table-column label="是否付款" width="100">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status == 1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="50">
        </el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{scope.row.update_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" round
                @click="showEditDialog(scope.row.order_id)">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="定位信息" placement="bottom" :enterable="false">
              <el-button type="success" icon="el-icon-location" size="mini" round>
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

      <!-- 编辑订单的弹窗区域 -->
      <el-dialog title="修改地址" @close="editOrderFormClosed()" :visible.sync="editOrderFormVisiable">
        <el-form ref="editOrderFormRef" :rules="editOrderFormRules" :model="editOrderForm" label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader :options="cityData" v-model="editOrderForm.address1"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址:" prop="address2">
            <el-input v-model="editOrderForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editOrderFormVisiable = false">取 消</el-button>
          <el-button type="primary" @click="editOrderAddress()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import cityData from './citydata.js'
  export default {
    name: "Order",
    created() {
      this.getOrderList();
    },
    computed: {

    },
    data() {
      return {
        /* 城市信息 */
        cityData: cityData,
        /* 编辑订单 */
        editOrderForm: {
          address1: [],
          address2: '',
        },
        /* 编辑订单的规则 */
        editOrderFormRules: {
          address1: [{
            required: true,
            message: '请选择省市区县',
            trigger: 'blur'
          }, ],
          address2: [{
            required: true,
            message: '请填写详细地址',
            trigger: 'blur'
          }, ],
        },
        /* 控制编辑对话框是否能显示 */
        editOrderFormVisiable: false,
        /* 保存订单列表数据 */
        orderList: [],
        /* 查询列表的请求参数 */
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10,
        },
        /* 总页数 */
        total: 0,
        id: ''
      }
    },
    methods: {
      /* 修改订单地址 */
      editOrderAddress() {
          this.$refs.editOrderFormRef.validate(async valid =>{
              if (!valid) {
                  return 
              }
              /* 如果合法 */
              this.$message.success('修改成功!');
              this.getOrderList();
              this.editOrderFormVisiable = false;
          })
      },
      editOrderFormClosed() {
        this.$refs.editOrderFormRef.resetFields();
      },
      /* 展示编辑区域 */
      showEditDialog(id) {
        this.id = id;
        this.editOrderFormVisiable = true;
      },
      async getOrderListByID() {
        /* 发起请求 */
        const {
          data: res
        } = await this.$http.get(`orders/${this.id}`);
        if (res.meta.status !== 200) {
          return this.$message.error("获取列表失败");
        }
        /* 赋值 */
        console.log(res.data);
        /* 赋值 */

      },
      /* 底部区域页数变换 */
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        //重新获取数据
        this.getOrderList()
      },
      //监听SizeChange
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        //重新获取数据
        this.getOrderList()

      },
      async getOrderList() {
        /* 发起请求 */
        const {
          data: res
        } = await this.$http.get('orders', {
          params: this.queryInfo
        });
        if (res.meta.status !== 200) {
          return this.$message.error("获取列表失败");
        }
        /* 赋值 */
        this.orderList = res.data.goods;
        this.total = res.data.total;
      }
    },
  };

</script>

<style lang="less" scoped>
  .order-container {
    width: 100%;
    height: 100%;
  }

  .el-cascader {
    width: 100%;
  }

</style>
