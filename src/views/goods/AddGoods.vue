<template>
  <div class="add-goods-container">
    <!-- 面包屑展示区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图列表展示区域 -->
    <el-card class="box-card" shadow='hover'>
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 注意此处的包裹关系，是使用form包裹tab -->
      <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-width="100px"
        class="demo-ruleForm" label-position="top">
        <!-- tab栏区域 -->
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabsLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!--  options指定数据源-->
              <!-- props指定 配置对象 -->
              <!-- 级联选择框 -->
              <el-cascader v-model="addGoodsForm.goods_cat" :options="cateList" :props="cascaderProps"
                @change="handleChange()">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action	必选参数，上传的地址 -->
            <el-upload class="upload-demo" :action="uploadURL" :headers="headerObj" :on-success="handleSuccess"
              :on-remove="handleRemove" :on-preview="handlePreview" list-type="picture">
              <el-button size="small" type="primary" round>点击上传</el-button>
            </el-upload>

          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="myQuillEditor" v-model="addGoodsForm.goods_introduce" class="ql-editor" />
            <el-button type="primary" style="margin-top:20px;margin-left:12px" @click="addGoods()">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片展示区域 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="imgPreview">

    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'AddGoods',
    created() {
      this.getCateList();
    },
    computed: {
      cateId() {
        if (this.addGoodsForm.goods_cat.length === 3) {
          return this.addGoodsForm.goods_cat[2]
        } else {
          return null;
        }
      }
    },
    data() {
      return {
        previewVisible: false,
        /* 图片预览路径 */
        previewPath: '',
        /* 图片上传的请求头 */
        headerObj: {
          /* 增加token */
          Authorization: window.sessionStorage.getItem('token')
        },
        /* 上传的URL */
        uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
        /* 静态属性列表 */
        onlyTableData: [],
        /* 动态参数列表 */
        manyTableData: [],
        /* 级联选择器的配置对象 */
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          expandTrigger: 'hover'
        },
        /* 存放分类列表 */
        cateList: [],
        /* 添加商品规则 */
        addGoodsFormRules: {
          goods_name: [{
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }],
          goods_weight: [{
            required: true,
            message: '请输入重量',
            trigger: 'blur'
          }],
          goods_price: [{
            required: true,
            message: '请输入价格',
            trigger: 'blur'
          }],
          goods_number: [{
            required: true,
            message: '请输入数量',
            trigger: 'blur'
          }],
          goods_cat: [{
            required: true,
            message: '请选择商品分类',
            trigger: 'blur'
          }],
        },
        /* 添加商品 */
        addGoodsForm: {
          goods_name: '',
          /* 商品所属的分类数组 */
          goods_cat: [],
          goods_price: '',
          goods_number: '',
          goods_weight: '',
          pics: [],
          goods_introduce: '',
          attrs: []
        },
        activeIndex: '0',
      }
    },
    methods: {
      /* 添加商品 */
      addGoods() {
        this.$refs.addGoodsFormRef.validate(
          (async valid => {
            if (!valid) {
              return this.$message.error('请填写必要项！')
            }
            /* 如果表单与验证通过 */
            /* 发起数据请求 */
            /* 数据预处理 */


            /* 处理动态参数和静态属性 */
            this.manyTableData.forEach(item => {
              const info = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals
              };
              this.addGoodsForm.attrs.push(info);
            })
            this.onlyTableData.forEach(item => {
              const info = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals
              };
              this.addGoodsForm.attrs.push(info);
            })
            /* 深拷贝 */
            const addForm = JSON.parse(JSON.stringify(this.addGoodsForm));
            addForm.goods_cat = addForm.goods_cat.join(',');
            /* 发起请求 */
            console.log(addForm);
            const {
              data: res
            } = await this.$http.post('goods', addForm);
            console.log(res);
            if (res.meta.status !== 201) {
              return this.$message.error(res.meta.msg);
            }
            /* 添加成功，并且跳转 */
            this.$message.success('添加商品成功');
            this.$router.push('/goods')
          })
        )
      },
      /* 监听图片上传成功 */
      handleSuccess(res) {
        const info = {
          pic: res.data.tmp_path
        };
        this.addGoodsForm.pics.push(info);
      },
      /* 处理移除图片的操作 */
      handleRemove(file) {
        const filePath = file.response.data.tmp_path;
        const index = this.addGoodsForm.pics.findIndex(x => {
          x.pic === filePath
        });
        /* 使用splice方法删除 */
        this.addGoodsForm.pics.splice(index, 1);
      },
      /* 处理图片预览效果 */
      handlePreview(file) {
        this.previewPath = file.response.data.url;
        this.previewVisible = true;

      },
      /* 标签页点击的时候 */
      async tabClicked() {
        /* 如果访问的是动态参数面板 */
        if (this.activeIndex === '1') {
          /* 发起请求 */
          const {
            data: res
          } = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'many'
            }
          })
          if (res.meta.status !== 200) {
            return this.$message.error("获取动态参数列表失败")
          }
          res.data.forEach((item) => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          });
          this.manyTableData = res.data;
          console.log(this.manyTableData);
        } else if (this.activeIndex === '2') {
          /* 发起请求 */
          const {
            data: res
          } = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'only'
            }
          })
          if (res.meta.status !== 200) {
            return this.$message.error("获取静态参数列表失败")
          }
          this.onlyTableData = res.data;
          console.log(this.onlyTableData);
        }
      },
      /* 标签页离开之前 */
      beforeTabsLeave(activeName, old) {
        if (old === '0' && this.addGoodsForm.goods_cat.length !== 3) {
          this.$message.info("请选择第三级商品分类！")
          return false;
        }
      },
      /* 级联选择器发生变化的时候 */
      handleChange() {
        if (this.addGoodsForm.goods_cat.length !== 3) {
          this.$message.info('请选择第三级商品分类！');
          this.addGoodsForm.goods_cat = [];
          return;
        }
        console.log(this.addGoodsForm.goods_cat);
      },
      /* 获取商品分类数据列表 */
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
      }
    },
  }

</script>

<style lang="less">
  .add-goods-container {
    width: 100%;
    height: 100%;
  }

  .el-checkbox {
    margin: 0 5px 0 0 !important;
  }

  .imgPreview {
    width: 100%;
  }

</style>
