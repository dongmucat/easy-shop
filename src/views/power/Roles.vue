<template>
  <div class="roles-container">
    <!-- 面包屑展示区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card
      class="box-card"
      shadow='hover'
    >
      <!-- 添加角色区域 -->
      <el-row style="margin-bottom:20px">
        <el-col>
          <el-button
            type="primary"
            @click="addDialogVisible = true"
          >点击添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表展示区域 -->
      <el-table
        :data="rolesList"
        border
        stripe
        style="margin-bottom:20px"
      >
        <!-- 第一列：索引列 -->

        <el-table-column type="expand">
          <template v-slot=scope>
            <el-row
              class="rights-info center"
              v-for="item in scope.row.children"
              :key="item.id"
            >
              <!-- 渲染第一列 -->
              <el-col :span="5">
                <!-- 使用标签tag渲染 -->
                <el-tag
                  type="primary"
                  closable
                  @close="removeRightById(scope.row,item.id)"
                >
                  {{item.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染第二级和第三级别的权限 -->
              <el-col :span="19">
                <el-row
                  v-for="item2 in item.children"
                  :key="item2.id"
                  class="center"
                >
                  <!-- 第二级渲染 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 第三级渲染 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

          </template>
        </el-table-column>

        <!-- 第二列 :序号-->
        <el-table-column type="index">
        </el-table-column>
        <!-- 第三列:权限名称 -->
        <el-table-column
          prop="roleName"
          label="角色名称"
        >
        </el-table-column>
        <!-- 第四列:路径 -->
        <el-table-column
          prop="roleDesc"
          label="角色描述"
        >
        </el-table-column>
        <!-- 第五列:操作 -->
        <el-table-column
          label="操作"
          width="180px"
        >
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="bottom"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                round
                @click="getRoleById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="bottom"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                round
                @click="deleteRole(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="bottom"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                round
                @click="showSetRightDialog(scope.row)"
              ></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
      <!-- 添加用户弹窗区域 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="40%"
        @close="addRolesDialogClosed()"
      >
        <!-- 添加角色表单 -->
        <el-form
          ref="addRolesRef"
          :model="addRoles"
          label-width="100px"
          :rules="addRolesRules"
        >
          <el-form-item
            label="角色名称:"
            prop="roleName"
          >
            <el-input
              v-model="addRoles.roleName"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述:"
            prop="roleDesc"
          >
            <el-input
              v-model="addRoles.roleDesc"
              placeholder="请输入角色描述"
            ></el-input>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="add-dialog-footer"
        >
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addRole()"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加编辑弹窗区域 -->
      <el-dialog
        title="添加用户"
        :visible.sync="editDialogVisible"
        width="40%"
        @close="editRolesDialogClosed()"
      >
        <!-- 添加角色表单 -->
        <el-form
          ref="editRolesRef"
          :model="editRole"
          label-width="100px"
          :rules="addRolesRules"
        >
          <el-form-item label="角色ID:">
            <el-input
              v-model="editRole.roleId"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="角色名称:"
            prop="roleName"
          >
            <el-input v-model="editRole.roleName"></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述:"
            prop="roleDesc"
          >
            <el-input v-model="editRole.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="add-dialog-footer"
        >
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editRoles()"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限弹窗区域 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="40%"
        @close="setRightDialogClosed()"
      >
        <!-- 树形控件 -->
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
        >
        </el-tree>
        <span
          slot="footer"
          class="add-dialog-footer"
        >
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="allotRights()"
          >确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  created() {
    this.getRolesList()
  },
  data() {
    return {
      /* 用于分配权限的时候，保存用户的id */
      roleId:'',
      /* 默认勾选的权限ID的数组 */
      defKeys:[],
      /* 树形控件props */
      treeProps:{
        children:'children',
        label:'authName'
      },
      /* 存放获取到的权限列表 */
      rightsList:[],
      /* 控制添加角色表单 */
      addDialogVisible: false,
      /* 控制分配权限表单 */
      setRightDialogVisible: false,
      /* 控制编辑角色表单 */
      editDialogVisible: false,
      /* 存放角色列表数组 */
      rolesList: [],
      /* 添加角色存放的对象 */
      addRoles: {
      /* 角色名称 */
      roleName: '',
      /* 角色描述 */
      roleDesc: ''
      },
      /* 添加角色规则 */
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      editRole: {
        roleId: '',
        /* 角色名称 */
        roleName: '',
        /* 角色描述 */
        roleDesc: ''
      }
    }
  },
  methods: {
    /* 分配权限 */
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]

      const idStr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      /* 如果成功 */
      this.$message.success(res.meta.msg)
      /* 刷新列表 */
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    /* 分配权限弹窗关闭事件 */
    setRightDialogClosed(){
      /* 清空defKeys */
      this.defKeys = []
    },
    /* 通过递归的形式得到点击的角色的所有的三级权限，并且保存到 defKeys*/
    getLeafKeys(node,arr){
      /* 如果node的孩子为空 */
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item,arr)
      });
    },
    /* 展示分配权限的弹窗 */
    async showSetRightDialog(role){
      /* 临时保存id，用于 点击确定后 提交所分配好的权限 */
      this.roleId = role.id
      const {data:res} = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      /* 如果成功 */
      /* 把获取到的权限数据保存到列表中 */
      this.rightsList = res.data
      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible = true
    },
    /* 获取角色列表函数 */
    async getRolesList() {
      /* 发起获取rolesList */
      const { data: res } = await this.$http.get('roles')
      /* 如果请求失败 */
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      /* 如果请求成功了 */
      this.rolesList = res.data
      /*       console.log(this.rolesList); */
    },
    async removeRightById(role, rightId) {
      /* 弹窗询问是否要删除 */
      const confirmResult = await this.$messageBox.confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      /* 如果取消 */
      /*       console.log(confirmResult); */
      if (confirmResult !== 'confirm') {
        return this.$message.info('已撤销删除操作')
      }
      /* 如果确定 */
      /* 发起删除该用户的权限的请求 */
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      /* 如果请求失败 */
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      /* 如果请求成功 */
      this.$message.success(res.meta.msg)
      /* 刷新   这里是为了体验更好，不会重新折叠*/
      role.children = res.data
      /* this.getRolesList() */
    },
    /* 监视添加角色弹窗关闭 */
    addRolesDialogClosed() {
      this.$refs.addRolesRef.resetFields()
    },

    /* 监视编辑角色弹窗关闭 */
    editRolesDialogClosed() {
      this.$refs.editRolesRef.resetFields()
    },
    /* 添加角色 */
    addRole() {
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) return

        /* 发起添加角色请求 */
        const { data: res } = await this.$http.post('roles', this.addRoles)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }

        /* 刷新列表 */
        this.getRolesList()
        /* 关闭窗口 */
        this.addDialogVisible = false
        /* 提示成功 */
        this.$message.success('添加角色成功！')
      })

    },
    /* 删除角色 */
    async deleteRole(id) {
      const confirmResult = await this.$messageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示',
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
      if (confirmResult !== 'confirm') { return this.$message.info('已撤销删除角色操作') }
      //如果确定
      const { data: res } = await this.$http.delete(`roles/${id}`)
      //如果删除不成功
      if (res.meta.status !== 200) {
        return this.$message.info(res.meta.msg)
      }
      //如果删除成功
      this.editDialogVisible = false
      this.$message.success(res.meta.msg)
      //刷新列表
      this.getRolesList()
    },
    /* 根据ID查询角色 */
    async getRoleById(id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色失败')
      }
      /* 如果成功 */
      this.editRole = res.data
      this.editDialogVisible = true
    },
    /* 编辑角色信息 */
    editRoles() {
      this.$refs.editRolesRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`roles/${this.editRole.roleId}`, this.editRole)
        if (res.meta.status !== 200) {
          return this.$message.error('修改')
        }
        /* 关闭弹窗 */
        this.editDialogVisible = false
        /* 刷新列表 */
        this.getRolesList()
        this.$message.success('编辑成功！')

      })
    }
  },
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.roles-container {
  width: 80%;
  height: 100%;
}
.el-tag {
  margin: 7px;
}
.rights-info {
  border-bottom: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
</style>