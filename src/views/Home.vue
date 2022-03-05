<template>
  <!-- 整体布局先上下划分再左右划分 -->
  <el-container class="home-container">
    <el-header>
      <!-- 头部区域 -->
      <Header></Header>
    </el-header>
    <el-container>
      <!-- Aside区域 -->
      <el-aside width=auto>
        <Aside></Aside>
      </el-aside>
      <el-main>
        <!-- main区域 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import Aside from '../components/Aside.vue'
import Header from '../components/Header.vue'
export default {

  name: 'Home',
  created(){

  },
  components:{
    Aside,
    Header
  },
  data() {
    return {
      
    }
  },
  methods: {

  },
  computed:{
    menuWidth(){
      return this.$store.state.tab.isCollapse ? '64px':'200px'
    }
  }

}
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;
}

.el-header{
  background-color: #363d47;
}

.el-aside {
  background-color: #f6f8fa;
}
.el-main {
  background-color: #f0f0f0;
}
</style>
