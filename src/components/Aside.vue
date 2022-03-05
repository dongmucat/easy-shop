<template>
  <div class="aside-container" >
    <div class="toggle-button" @click="handleMenu">
      | | |
    </div>
    <el-menu
      router
      default-active="2"
      class="el-menu-vertical-demo"
      unique-opened
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#409eff"
      :collapse="isCollapse"
      :collapse-transition="false"
    >
    <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <!-- 图表 -->
          <i :class="iconObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
    <!-- 二级菜单 -->
          <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>{{subItem.authName}}</span>
          </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Aside',
  created(){
    this.getMenuList()
  },
  data() {
    return {
      menuList:[],
      iconObj:{
        '125':'el-icon-user',
        '103':'el-icon-key',
        '101':'el-icon-s-shop',
        '102':'el-icon-tickets',
        '145':'el-icon-coin',
      },
      isCollapse:false
    }
  },
  computed:{

  },
  methods: {
    async getMenuList(){
      const {data:res}= await this.$http.get('menus')
      console.log(res)
      //如果失败了
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }//如果成功了
      else{
        //赋值
        this.menuList = res.data
      }

    },
    handleMenu(){
      this.isCollapse = !this.isCollapse
    }
  },
}
</script>

<style lang="less" scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
.aside-container {
  /* 集成父亲的宽高 */
    height: 100%;
  background-color:#545c64;
  .el-menu {

    border-right: 0;
  }
  .toggle-button{
    height: 33px;
    background-color: #545c64;
    color: #fff;
    font-size: 10px;
    text-align: center;
    line-height: 33px;
    cursor: pointer;
  }
  .toggle-button:hover{
    background-color: #6c7681;
  }
}
</style>