<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">BOE</h3>
      <el-form-item prop="username" style="background-color: white;border: 1px solid aquamarine;">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" type="text" placeholder="请输入手机号" style="width:78%;border:none;outline-color: white;"/>
      </el-form-item>
      <el-form-item prop="password" style="background-color: white;border: 1px solid aquamarine;">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :type="pwdType" v-model="loginForm.password" name="password" auto-complete="on" placeholder="请输入密码" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" style="margin-top: 1px" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item >
      <el-form-item prop="card" style="background-color: white;border: 1px solid aquamarine;">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col>
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input v-model="loginForm.card" type="text" placeholder="请输入验证码" />
          </el-col>
        </el-row>
        <el-button :disabled="cardDisabled" type="primary" plain class="button" style="position: absolute; right: 0px; height: 52px; top: 0px;" @click="Obtain">{{ cardDisabled ? time + 's后获取' : '获取验证码' }}</el-button>
      </el-form-item>
      <el-form-item style="background-color: white">
        <!--<el-col  style="float: left; background-color: white; width: 1%;">-->
        <!--</el-col>-->
      </el-form-item>
      <el-form-item style="background-color: white;margin-top: -40px;">
        <div class="pas">
          <div style="color: red;float: left; cursor:pointer ;" @click="goModify">忘记密码？</div>
          <el-checkbox v-model="checked" style="float: right">记住密码</el-checkbox>
        </div>
      </el-form-item>
      <el-form-item style="background-color: white">
        <el-button :loading="loading" type="primary" style="width:100%;height: 47px; border: none; font-size: 20px;" @click.native.prevent="phoneLogin">
          登    录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getVerificationCode } from '@/api/login'
export default {
  name: 'Login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!this.verification.phone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      checked: true,
      loginForm: {
        username: '',
        password: '',
        card: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validPhone }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
        // card: [{ required: true, trigger: 'blur' }]
      },
      loading: false,
      cardDisabled: false,
      pwdType: 'password',
      redirect: undefined,
      time: 60
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
        this.getCookie()
      },
      immediate: true
    }
  },
  methods: {
    Obtain() {
      const params = {
        id: this.loginForm.username
      }
      getVerificationCode(params).then(res => {
        this.$message({
          message: '验证码已发送，请注意查收',
          type: 'w'
        })
        this.card()
      })
    },
    card() {
      this.time = 60
      this.cardDisabled = true
      setInterval(e => {
        if (this.time === 0) {
          clearInterval()
          this.cardDisabled = false
        } else {
          this.time = this.time - 1
        }
      }, 1000)
    },
    goModify() {
      this.$router.push({
        path: '/forgetPassword'
      })
    },
    // 手机号登录
    phoneLogin() {
      if (!this.loginForm.username) {
        this.$message({
          message: '手机号不能为空',
          type: 'error'
        })
        return
      }
      const params = {
        mobile: this.loginForm.username,
        num: this.loginForm.card,
        password: this.loginForm.password
      }
      this.$store.dispatch('loginByMboile', params).then(() => {
        if (this.checked) {
          this.setCookie(this.loginForm.username, this.loginForm.password, 30)
        } else {
          this.setCookie('', '', 0)
        }
        this.loading = false
        this.$router.addRoutes(this.$store.state.user.router)
        this.$router.push({ path: '/home' })
      }).catch(() => {
        this.loading = false
      })
      // loginByMboile(params).then(res => {
      //   this.$message({
      //     message: '登录成功'
      //   })
      // })
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.addRoutes(this.$store.state.user.router)
            this.$router.push({ path: '/home' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setCookie(name, passwrod, exdays) {
      var exdate = new Date()
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays)
      window.document.cookie = 'userName' + '=' + name + ';path=/;expires=' + exdate.toGMTString()
      window.document.cookie = 'userPwd' + '=' + passwrod + ';path=/;expires=' + exdate.toGMTString()
    },
    getCookie() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ')
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=')
          if (arr2[0] === 'userName') {
            this.loginForm.username = arr2[1]
          } else if (arr2[0] === 'userPwd') {
            this.loginForm.password = arr2[1]
          }
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $light_gray:#eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: darkolivegreen;
        height: 47px;
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background: url("../../assets/img/pic_2.png") center no-repeat;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      height: 426px;
      border-radius:10px;
      max-width: 100%;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
      background-color: white;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
      color:#409EFF;
      margin-bottom: 22px;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
      margin-top: -8px;
    }
  }
/*  .color{
    background-color: white;
    border: 1px solid aquamarine;
    width: 275px;
    height: 32px;
    margin: 0 auto;
    margin-bottom: 30px;
  }
  .color1{
    background-color: white;
    border: 1px solid aquamarine;
    width: 230px;
    height: 32px;
    margin: 0 auto;
    margin-left:20px;
  }
  .button{
    height:32px;
    width: 70px;
    background-color: #44abf0;
    color: white;
    font-size: 3px;
    padding: 2px;
  }
  .pas{
    width: 267px;
    height: 32px;
    margin-top: -23px;
    margin-left: 24px;
  }*/
</style>
