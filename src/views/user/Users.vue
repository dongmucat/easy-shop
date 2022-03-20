<template>
  <div class="user-container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片展示区域 -->
    <el-card class="box-card" shadow="hover">
      <!-- 搜素与添加区域 -->
      <el-row :gutter="20">
        <!-- 搜索区域 -->
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable class="input-with-select"
            @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <!-- 添加区域 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">
            点击添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe style="margin-bottom:20px">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column label="姓名" prop="username">
        </el-table-column>
        <el-table-column label="邮箱" prop="email">
        </el-table-column>
        <el-table-column label="电话" prop="mobile">
        </el-table-column>

        <el-table-column label="角色" prop="role_name">
        </el-table-column>

        <!-- 状态区域 -->
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template v-slot="scope">
            <el-switch @change="userStateChanged(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作区域 -->

        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" round @click="showEditDialog(scope.row.id)">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" round @click="deleteUser(scope.row.id)">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="bottom" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" round @click="setRole(scope.row)">
              </el-button>
            </el-tooltip>

          </template>
        </el-table-column>

      </el-table>
      <!-- 底部分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 添加用户弹窗区域 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
        <!-- 添加用户表单 -->
        <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
          <el-form-item label="用户名:" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="add-dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户弹窗区域 -->
      <el-dialog title="编辑用户信息" :visible.sync="editDialogVisible" width="40%" @close="editDialogClosed()">
        <!-- 编辑用户表单区域 -->
        <el-form ref="editFormRef" label-width="80px" :rules="editFormRules" :model="editForm">
          <el-form-item label="用户名:">
            <el-input :disabled="true" v-model="editForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="edit-dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色查看弹窗 -->
      <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="30%" @close="setRoleDialogClosed()">
        <p>当前的用户:{{userInfo.username}}</p>
        <p>当前的角色:{{userInfo.role_name}}</p>
        <p>分配新的角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
              <!--注意此处的  :value="item.id"  这样的话选中之后selectedRoleId里面就是ID-->
            </el-option>
          </el-select>
        </p>

        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Users',
    data() {
      var checkPhone = (rule, value, callback) => {
        const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
        if (!value) {
          return callback(new Error('电话号码不能为空'))
        }
        setTimeout(() => {
          // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
          // 所以我就在前面加了一个+实现隐式转换

          if (!Number.isInteger(+value)) {
            callback(new Error('请输入数字值'))
          } else {
            if (phoneReg.test(value)) {
              callback()
            } else {
              callback(new Error('电话号码格式不正确'))
            }
          }
        }, 100)
      }
      var checkEmail = (rule, value, callback) => {
        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        if (!value) {
          return callback(new Error('邮箱不能为空'))
        }
        setTimeout(() => {
          if (mailReg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的邮箱格式'))
          }
        }, 100)
      }
      return {
        /* 被选中的角色的id */
        selectedRoleId: '',
        //所有的角色列表
        roleList: [],
        //信息
        userInfo: {},
        /* 控制权限的弹窗 */
        setRoleDialogVisible: false,
        /* 编辑用户存放的数据 */
        editForm: {

        },
        //获取用户列表的参数
        queryInfo: {
          query: '',
          /* 当前的页数*/
          pagenum: 1,
          /* 当前每页显示多少条数据 */
          pagesize: 10,
        },
        /* 展示用户列表的List */
        userList: [],
        /* 用户列表的总数 */
        total: 0,
        /* 控制增加用户弹窗区域是否可见 */
        addDialogVisible: false,
        /* 控制编辑用户弹窗区域是否可见 */
        editDialogVisible: false,
        /* 添加用户的数据 */
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: '',
        },
        /* 添加用户数据规则 */
        addFormRules: {
          username: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到 10 个字符',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到 10 个字符',
              trigger: 'blur'
            }
          ],
          email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [{
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: checkPhone,
              trigger: 'blur'
            }
          ],

        },
        /* 编辑用户规则 */
        editFormRules: {
          email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [{
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: checkPhone,
              trigger: 'blur'
            }
          ],
        }
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      /* 检测分配角色关闭事件 */
      setRoleDialogClosed() {
        /* 清空下拉选择 */
        this.selectedRoleId = '';
        this.userInfo = ''
      },
      /* 确定分配角色 */
      async saveRoleInfo() {
        /* 如果没选中 */
        if (!this.selectedRoleId) {
          return this.$message.error('请选择需要分配的角色')
        }

        const {
          data: res
        } = await this.$http.put(`users/${this.userInfo.id}/role`, {
          rid: this.selectedRoleId
        });
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        /* 如果成功 */
        this.$message.success(res.meta.msg);
        /* 刷新列表 */
        this.getUserList();
        /* 隐藏窗口 */
        this.setRoleDialogVisible = false;
        /*  */
      },
      //设置分配角色
      async setRole(userInfo) {
        //赋值
        this.userInfo = userInfo;
        //在弹出对话框之前获取所有的角色列表
        const {
          data: res
        } = await this.$http.get('roles');
        /* 如果失败 */
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        /* 如果成功 */
        this.roleList = res.data;
        this.setRoleDialogVisible = true;
      },
      async getUserList() {
        const {
          data: res
        } = await this.$http.get('users', {
          params: this.queryInfo
        })
        /* 如果请求不成功 */
        if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
        /* 如果获取成功 */
        this.userList = res.data.users
        this.total = res.data.total
      },
      //监听SizeChange
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        //重新获取数据
        this.getUserList()

      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        //重新获取数据
        this.getUserList()
      },
      /* 监听switch 开关状态*/
      async userStateChanged(userInfo) {
        console.log(userInfo);
        const {
          data: res
        } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        if (res.meta.status !== 200) {
          //如果失败保持页面的中的用户状态
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error(res.meta.msg)
        }
        //如果成功
        this.$message.success(res.meta.msg)
      },
      /* 监听添加用户添加框关闭的事件 */
      addDialogClosed() {
        /* 重置添加用户的信息 */
        this.$refs.addFormRef.resetFields()
      },
      /* 监听编辑用户事件 */
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      /* 添加用户 */
      addUser() {
        this.$refs.addFormRef.validate(async valid => {
          //如果表单规则不符合则返回
          if (!valid) return
          //如果通过了发起添加用户的请求
          const {
            data: res
          } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          //如果添加用户成功
          this.$message.success(res.meta.msg)
          //关闭弹窗
          this.addDialogVisible = false
          //重新获取列表数据
          this.getUserList()
        })
      },
      async deleteUser(id) {
        const confirmResult = await this.$messageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
          return this.$message.info('已撤销删除用户操作')
        }
        //如果确定
        const {
          data: res
        } = await this.$http.delete(`users/${id}`)
        //如果删除不成功
        if (res.meta.status !== 200) {
          return this.$message.info(res.meta.msg)
        }
        //如果删除成功
        this.$message.success(res.meta.msg)
        //刷新列表
        this.getUserList()
      },
      async showEditDialog(id) {
        /* 展示编辑用户的对话框 */
        this.editDialogVisible = true
        /* 发起获取该用户信息请求 */
        const {
          data: res
        } = await this.$http.get(`users/${id}`)
        /* 如果请求失败了,弹出失败的提示窗口并且返回 */
        if (res.meta.status !== 200) {

          return this.$message.error(res.meta.msg)
        }
        /* 如果请求成功了 */
        this.editForm = res.data
        /*         this.$message.success(res.meta.msg) */
      },
      /* 编辑用户  */
      editUser() {
        this.$refs.editFormRef.validate(async valid => {
          //如果表单规则不符合则返回
          if (!valid) return
          /* 发起修改该用户信息请求 */
          const {
            data: res
          } = await this.$http.put(`users/${this.editForm.id}`, this.editForm)
          /* 如果请求失败了,弹出失败的提示窗口并且返回 */
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          /* 如果请求成功了 */
          /* 刷新列表 */
          this.getUserList()
          this.editDialogVisible = false
          this.$message.success(res.meta.msg)
        })
      }
    },
  }

</script>

<style lang="less">
  .user-container {
    height: 100%;
    width: 100%;
  }

  .box-card {}

  .el-breadcrumb {
    margin-bottom: 20px;
  }

  .el-table {
    margin-top: 20px;
    font-size: 15px;
  }

</style>
