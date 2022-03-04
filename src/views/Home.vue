<template>
  <div>
      <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
    name:'Home',
    data() {
        return {
            
        }
    },
    methods: {
        logout () {
            //清空sessionStoage
            window.sessionStorage.clear();
            //跳转到login页面
            this.$router.push({name:'login'});
        }
    },
}
</script>

<style>

</style>