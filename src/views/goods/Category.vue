<template>
  <div class="catogory-container">
    <!-- 面包屑展示区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图权限列表展示区域 -->
    <el-card
      class="box-card"
      shadow='hover'
    >
      <!-- 添加角色区域 -->
      <el-row style="margin-bottom:20px">
        <el-col>
          <el-button
            type="primary"
            @click="getParentCateList()"
          >点击添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 商品分类列表 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        :show-row-hover="false"
        style="margin-bottom:20px;"
      >
        <!-- 是否有效插槽 -->
        <template
          slot="isOk"
          scope="scope"
        >
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deleted"
            style="color:lightgreen;"
          ></i>
          <i
            class="el-icon-error"
            v-if="scope.row.cat_deleted"
            style="color:red;"
          ></i>
        </template>
        <!-- 排序插槽 -->
        <template
          slot="level"
          scope="scope"
        >
          <el-tag
            size="mini"
            v-if="scope.row.cat_level === 0"
          >一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-if="scope.row.cat_level === 1"
          >二级</el-tag>
          <el-tag
            type="warning"
            size="mini"
            v-if="scope.row.cat_level === 2"
          >三级</el-tag>
        </template>
        <!-- 操作插槽 -->
        <template
          slot="action"
          scope="scope"
        >
          <!-- 删除 -->

          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            round
            @click="deleteCate(scope.row.cat_id)"
          >删除</el-button>

          <el-button
            type="warning"
            icon="el-icon-setting"
            size="mini"
            round
            @click="showEditCateDialog(scope.row.cat_id)"
          >编辑</el-button>

        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的弹窗区域 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogFormVisible"
      @close="addCateDialogClosed()"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        ref="addCateFormRef"
        :rules="addCateFormRules"
        label-width="100px"
      >
        <el-form-item
          label="分类名称"
          prop="cat_name"
        >
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!--  options指定数据源-->
          <!-- props指定 配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged()"
            clearable
            change-on-select
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addCateDialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addCate()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑分类名称的弹窗区域 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogFormVisible"
    >
      <el-form
        ref="editCateFormRef"
        :rules="editCateFormRules"
        :model="editCateForm"
        label-width="100px"
      >
        <el-form-item label="用户名:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editCateDialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editCate()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Categery",
  created() {
    this.getGoodCategory();
  },
  data() {
    return {
      /* 控制编辑分类窗口是否显示 */
      editCateDialogFormVisible: false,
      /* 编辑分类存放的数据的规则 */
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      /* 编辑分类存放的数据 */
      editCateForm: {
        
      },
      /* 级联选择器中被选中的父级 */
      selectedKeys: [],
      /* 级联选择器的配置对象 */
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      /* 获取前两级的分类列表 */
      parentCateList: [

      ],
      /* 添加分类表单数据 */
      addCateForm: {
        /* 父级分类id */
        cat_pid: 0,
        cat_name: '',
        cat_level: 0,
      },
      /* 添加分类表单的规则 */
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },

        ],
      },
      /* 控制添加分类的弹窗是否显示 */
      addCateDialogFormVisible: false,
      /* tree-table column属性 */
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          //使用作用域插槽
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          minWidth: '200px',
          type: 'template',
          template: 'action',
        },
      ],
      /* 商品分类列表的总数 */
      total: 0,
      /* 请求的信息 */
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      /* 商品分类的数据列表，默认为空 */
      cateList: []
    }
  },
  methods: {
    /* 编辑分类名称 */
    editCate(){
      this.$refs.editCateFormRef.validate(async valid => {
        /* 如果不合法要求重新 */
        if (!valid) return;

        const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, this.editCateForm)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        //如果成功
        this.editCateDialogFormVisible = false;
        this.$message.success('修改成功');
        /* 刷新列表 */
        this.getGoodCategory();
      })
    },
    /* 控制展示编辑分类窗口 */
    async showEditCateDialog(id) {
      /* 根据ID查询相关的参数 */
      const {data:res} = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
      }

      //如果查询成功
      this.editCateForm = res.data;
      this.editCateDialogFormVisible = true;
    },
    /* 删除分类 */
    async deleteCate(id) {
      const confirmResult = await this.$messageBox.confirm('此操作将删除该分类, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).catch(err => err)
      /* 如果用户取消操作，则返回字符串 cancel
        如果用户确定操作，则返回字符串 confirm
      */
      //如果取消
      if (confirmResult !== 'confirm') { return this.$message.info('已撤销删除分类操作') }
      //如果确定
      const { data: res } = await this.$http.delete(`categories/${id}`)
      //如果删除不成功
      if (res.meta.status !== 200) {
        return this.$message.info(res.meta.msg)
      }
      //如果删除成功
      this.$message.success(res.meta.msg)
      //刷新列表
      this.getGoodCategory();
    },
    /* 监听添加分类弹窗关闭事件 */
    addCateDialogClosed() {
      /* 清空 */
      this.$refs.addCateFormRef.resetFields();
      /* 清空选中的数据 */
      this.selectedKeys = [];
      /* 还原添加分类的初始状态 */
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    /* 级联选择器发生变化的时候会触发此函数 */
    parentCateChanged() {
      /* console.log(this.selectedKeys); */
      /* 假如选中了父级分类 */
      if (this.selectedKeys.length > 0) {
        //父级分类id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        /* 分类的层级和数组的长度保持一致  (分类的层级从0开始) */
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        /* 分类的层级和数组的长度保持一致  (分类的层级从0开始) */
        this.addCateForm.cat_level = 0;
      }
    },
    /* 获取父亲分类 */
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      //如果成功
      this.addCateDialogFormVisible = true;
      this.parentCateList = res.data;
      /* console.log(this.parentCateList); */
    },
    /* 添加分类 */
    async addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        /* 如果不合法要求重新 */
        if (!valid) return;

        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        //如果成功
        this.addCateDialogFormVisible = false;
        this.$message.success('添加成功');
        /* 刷新列表 */
        this.getGoodCategory();
      })

    },
    /* 监听currentPage 改变时会触发 */
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      /* 刷新列表 */
      this.getGoodCategory();
    },
    /* 监听pageSize的改变 */
    handleSizeChange(newSize) {
      /* 更新数据 */
      this.querInfo.pagesize = newSize;
      /* 刷新列表 */
      this.getGoodCategory();
    },
    /* 获取商品分类数据列表 */
    async getGoodCategory() {
      /* 发起请求 */
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      //如果成功,将数据赋值给this.cateList
      this.cateList = res.data.result;
      this.total = res.data.total;
      /*  this.$message.success('获取商品分类数据列表成功'); */
      /* console.log(res.data); */
    }
  },
}
</script>

<style lang="less" scoped>
.catogory-container {
  height: 100%;
  width: 100%;
}
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-cascader {
  width: 100%;
}
</style>