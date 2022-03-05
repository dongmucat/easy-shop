<template>
    <div class="header-container">
     <div>
        <img src="../assets/imgs/user.jpg">
        <span>easy-shop后台管理系统</span>
      </div>
      <div>
        <el-button
        size="medium"
         round
          type="info"
          @click="logout"
        >退出</el-button>
      </div>
    </div>
</template>

<script>
export default {
    name:'Header',
    data() {
        return {
            
        }
    },
    methods: {
    clear() {
      //清空sessionStoage
      window.sessionStorage.clear();
      //跳转到login页面
      this.$router.push({ name: 'login' });
    },

    logout() {
      this.$messageBox.confirm('此操作将退出后台管理系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        });
        //清空并且跳转
        this.clear()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '还就内个不退出~'
        });
      });
    }

  }
}
</script>

<style lang="less" scoped>
.header-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: #fff;
  .el-button{

  }
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  //flex竖直居中
  div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 10px;
  }
}
</style>