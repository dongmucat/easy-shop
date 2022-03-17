<template>
  <div class="params-container">
    <!-- 面包屑展示区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片展示区域 -->
    <el-card class="box-card" shadow='hover'>
      <!-- 警告区域 -->
      <el-alert show-icon title="注意：只允许第三级分类设置相关参数" type="warning">
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cate_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader v-model="selectedKeys" :options="cateList" :props="cascaderProps" @change="handleChange()"
           >
          </el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick" lazy>
        <!-- 添加动态参数区域 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加动态参数按钮 -->
          <el-button type="primary" class="btn" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数
          </el-button>
          <!-- 动态数据表格区域 -->
          <el-table :data="manyList" border stripe>
            <!-- 展开 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引 -->
            <el-table-column type="index"></el-table-column>
            <!-- 参数名称 -->
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <template v-slot="scope">
                <!-- 删除 -->
                <el-tooltip class="item" effect="dark" content="删除" placement="bottom" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini" round
                    @click="deleteParams(scope.row.attr_id)">
                  </el-button>
                </el-tooltip>
                <!-- 编辑 -->
                <el-tooltip class="item" effect="dark" content="编辑" placement="bottom" :enterable="false">
                  <el-button type="warning" icon="el-icon-edit" size="mini" round
                    @click="showEditParamsDialog(scope.row)">
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性区域 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加静态属性按钮 -->
          <el-button type="primary" :disabled="isBtnDisabled" class="btn" @click="addDialogVisible = true">添加属性
          </el-button>
          <!-- 静态数据表格区域 -->
          <el-table :data="onlyList" border stripe>
            <!-- 展开 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引 -->
            <el-table-column type="index"></el-table-column>
            <!-- 参数名称 -->
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <template v-slot="scope">
                <!-- 删除 -->
                <el-tooltip class="item" effect="dark" content="删除" placement="bottom" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini" round
                    @click="deleteParams(scope.row.attr_id)">
                  </el-button>
                </el-tooltip>
                <!-- 编辑 -->
                <el-tooltip class="item" effect="dark" content="编辑" placement="bottom" :enterable="false">
                  <el-button type="warning" icon="el-icon-edit" size="mini" round
                    @click="showEditParamsDialog(scope.row)">
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加属性弹窗 -->
      <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" ef width="30%" @close="addDialogClosed()">
        <el-form :model="addForm" :rules="addFormRules" ref="addParamsFormRef" label-width="100px">
          <el-form-item label="活动名称" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑属性名称的弹窗区域 -->
      <el-dialog :title="'编辑'+this.titleText" :visible.sync="editParamsDialogVisible" @close="editParamsDialogClosed()">
        <el-form ref="editParamsFormRef" :rules="addFormRules" :model="editParamsForm" label-width="100px">
          <el-form-item :label="this.titleText" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editParamsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Params',
    created() {
      this.getCateList();
    },
    computed: {
      isBtnDisabled() {
        if (this.selectedKeys.length !== 3) {
          return true;
        } else {
          return false;
        }
      },
      cateId() {
        if (this.selectedKeys.length === 3) {
          return this.selectedKeys[2];
        } else {
          return null;
        }
      },
      /* 动态计算标题的文本 */
      titleText() {
        if (this.activeName === 'many') {
          return '动态参数';
        }
        return '静态属性';
      }
    },
    data() {
      return {
        /* 控制编辑弹窗是否显示 */
        editParamsDialogVisible: false,
        /* 编辑 */
        editParamsForm: {},
        /* 添加表单的规则 */
        addFormRules: {
          attr_name: [{
            required: true,
            message: '输入不能为空!',
            trigger: 'blur'
          }]
        },
        /* 存放添加表单的数据 */
        addForm: {
          attr_name: '',
        },
        /* 控制添加的弹窗显示 */
        addDialogVisible: false,
        /* 静态属性列表 */
        onlyList: [],
        /* 动态参数列表 */
        manyList: [],
        /* 被激活时的名称 */
        activeName: 'many',
        /* 级联选择框双向绑定对象 */
        selectedKeys: [],
        /* 商品分类列表 */
        cateList: [],
        /* 级联选择器的配置对象 */
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          expandTrigger: 'hover'
        },
      }
    },
    methods: {
      /* 删除参数 */
      async deleteParams(id) {
        const confirmResult = await this.$messageBox.confirm('此操作将删除该参数, 是否继续?', '提示', {
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
          return this.$message.info('已撤销删除操作')
        }
        //如果确定
        const {
          data: res
        } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
        //如果删除不成功
        if (res.meta.status !== 200) {
          return this.$message.info(res.meta.msg)
        }
        //如果删除成功
        this.$message.success(res.meta.msg)
        //刷新列表
        this.getParamsList();
      },
      /* 展示编辑窗口 */
      showEditParamsDialog(row) {
        this.editParamsDialogVisible = true;
        /* 深拷贝,不然会出问题,修改到 manyList或者onlyList 中的内容 */
        this.editParamsForm = JSON.parse(JSON.stringify(row));
        /* console.log(this.editParamsForm); */
      },
      /* 重置编辑 */
      editParamsDialogClosed() {
        this.$refs.editParamsFormRef.resetFields();
      },
      /* 编辑名称 */
      editParams() {
        this.$refs.editParamsFormRef.validate(async (valid) => {
          if (!valid) {
            return
          }
          /* 如果合法 */
          /* 发起请求 */
          const {
            data: res
          } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`, {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName
          })
          /* 如果失败 */
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          /* 如果成功 */
          this.$message.success('修改成功');
          this.editParamsForm = {};
          this.editParamsDialogVisible = false;
          /* 刷新 */
          this.getParamsList();
        })
      },

      /* 添加操作 */
      addParams() {
        this.$refs.addParamsFormRef.validate(async (valid) => {
          if (!valid) {
            return
          }
          /* 如果合法 */
          /* 发起请求 */
          const {
            data: res
          } = await this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          /* 如果失败 */
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg);
          }
          /* 如果成功 */
          this.$message.success('添加成功');
          this.addDialogVisible = false;
          /* 刷新 */
          this.getParamsList();
        })
      },
      /* 添加弹窗关闭事件 */
      addDialogClosed() {
        this.$refs.addParamsFormRef.resetFields()
      },
      /* 获取参数列表 */
      async getParamsList() {
        if (this.cateId === null) return this.$message.info('请选择商品分类!')
        const {
          data: res
        } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: this.activeName
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('请求失败!');
        }
        /* 如果成功 */
        if (this.activeName === 'many') {
          this.manyList = res.data;
          console.log(this.manyList);
        } else if (this.activeName === 'only') {
          this.onlyList = res.data;
          console.log(this.onlyList);
        }

      },
      /* tab页签发生点击事件的时候,会触发此函数 */
      handleClick() {
        console.log(this.activeName);
        this.getParamsList();
      },
      /* 级联选择框中项变化,会触发此函数 */
      handleChange() {
        console.log(this.selectedKeys);
        this.getParamsList();
      },
      /* 获取分类列表 */
      async getCateList() {
        /* 发起请求 */
        const {
          data: res
        } = await this.$http.get('categories')
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        //如果成功,将数据赋值给this.cateList
        this.cateList = res.data;
        /*  this.$message.success('获取商品分类数据列表成功'); */
        /* console.log(this.cateList); */
      }
    },
  }

</script>

<style lang="less" scoped>
  .btn {
    margin-bottom: 20px;
  }

  .catogory-container {
    height: 100%;
    width: 100%;
  }

  .el-breadcrumb {
    margin-bottom: 20px;
  }

  .cate_opt {
    margin: 20px 0;

    span {
      font-size: 15px;
    }
  }

</style>
