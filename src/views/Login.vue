<template>
  <div class="login_container">
      <div class="login_box">
        <!-- 头像区域 -->
          <div class="avatar_box">
            <img src="../assets/imgs/user.jpg" alt="">
          </div>
          <!--  -->
            <el-form ref="loginFormRef" :model="loginForm" label-width="80px" class="login_form" :rules="rules">
              <!-- 用户名 -->
              <el-form-item label="用户名:" prop="username">
                <el-input v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <!-- 密码 -->
              <el-form-item label="密码:"  prop="password">
                <el-input v-model="loginForm.password" prefix-icon="el-icon-key" placeholder="请输入密码" type="password"></el-input>
              </el-form-item>
              <!-- 按钮区域 -->
              <el-form-item  class="btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetLoginForm">重置</el-button>
              </el-form-item>
          </el-form>
      </div>
  </div>
</template>

<script>
export default {
  name:'Login',
  data() {
    return {
      loginForm: {
        username:'',
        password:'',
      },
      rules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur'},
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],        
        password:[
          { required: true, message: '请输密码', trigger: 'blur'},
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //点击重置按钮，重置登录数据
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields()
    },
    login(){
       this.$refs.loginFormRef.validate(async (valid) => {
         //如果不合法则返回
         if(!valid) return 

          const {data:result}  =  await this.$http.post('login',this.loginForm)
          
          console.log(result)
          //清空输入框
          this.loginForm.username = ''
          this.loginForm.password = ''
          //如果登录失败
          if (result.meta.status !== 200) {
            this.$message.error(`${result.meta.msg}，请重新输入！`)
            return 
          }

          this.$message.success("登录成功")
          //登录成功之后的token，保存到客户端的sessionStorage中
          window.sessionStorage.setItem('token',result.data.token)

          //通过路由跳转到home页面
          this.$router.push({
            name:'home'
          })
          

       });
    }
  },
}
</script>

<style lang='less' scope>
.login_container{
  background-color: #deebf3;
  height: 100%;
}
.login_box{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 450px;
  height: 300px;
  background-color: #fafafa;
  border-radius: 15px;
  .avatar_box{
    position: absolute;
    height: 130px;
    width: 130px;
    background-color: #deebf3;
    top:50%;
    padding:5px;
    transform:translate(10%,-50%);
    border-radius: 50%;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
}
.btns{
  display:flex;
  justify-content:flex-end;
}

.login_form{
  position: absolute;
  top:50%;
  transform:translate(45%,-35%);
}

}


</style>