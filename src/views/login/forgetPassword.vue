<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">BOE</h3>
      <el-form-item prop="mobile" style="background-color: white;border: 1px solid aquamarine;">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.mobile" name="username" type="text" auto-complete="on" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="newPassword" style="background-color: white;border: 1px solid aquamarine;">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input v-model="loginForm.newPassword" name="username" type="password" auto-complete="on" placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item prop="mobileVerification" style="background-color: white;border: 1px solid aquamarine;">
        <el-row type="flex" class="row-bg" justify="space-between" style="position:relative;">
          <el-col>
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input v-model="loginForm.mobileVerification" placeholder="请输入验证码"/>
          </el-col>
          <el-col :span="6">
            <el-button :disabled="cardDisabled" type="info" plain style="height:100%;position:absolute;right:0;" @click="Obtain">{{ cardDisabled ? time + 's后获取' : '获取验证码' }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <div style="color:red;margin-bottom:10px;" @click="back">
        返回登录页面
      </div>
      <el-form-item style="background-color: white">
        <el-button :loading="loading" type="primary" style="width:100%;height: 47px; border: none; font-size: 20px;margin-top: 20px;" @click.native.prevent="handleLogin">
          提 交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getVerificationCode, getVerification, accountFindPassword } from '@/api/login'
export default {
  name: 'Login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能少于5位'))
      } else if (!value) {
        callback(new Error('请输入电话号码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        mobile: '',
        mobileVerification: '',
        newPassword: ''
      },
      loginRules: {
        mobile: [{ required: true, trigger: 'blur' }],
        newPassword: [{ required: true, trigger: 'blur', validator: validatePass }],
        mobileVerification: [{ required: true, trigger: 'blur' }]
      },
      loading: false,
      cardDisabled: false,
      pwdType: 'password',
      redirect: undefined,
      time: 90,
      photoCard: '',
      imgUrl: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // const str = this.defines.BASE_API
    // this.imgUrl = JSON.parse(str)
    // this.photo()
  },
  methods: {
    photo() {
      getVerification().then(res => {
        this.photoCard = ''
        this.photoCard = res.data + '?' + Math.random()
        this.$forceUpdate()
      })
    },
    back() {
      this.$router.back()
    },
    Obtain() {
      if (!this.loginForm.mobile) {
        this.$message({
          message: '手机号不能为空',
          type: 'error'
        })
        return
      }
      const params = {
        id: this.loginForm.mobile
      }
      getVerificationCode(params).then(res => {
        this.$message({
          message: '验证码已发送，请注意查收',
          type: 'succes'
        })
        this.card()
      })
    },
    card() {
      this.time = 90
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
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      // const a = {
      //   id: this.loginForm.verification
      // }
      // accountVerify(a).then(res => {
      //   if (res.code == 1) {
      //     this.$message({
      //       message: '图片验证码错误',
      //       type: 'error'
      //     })
      //     return
      //   }
      // })
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const obj = {
            mobile: this.loginForm.mobile,
            mobileVerification: this.loginForm.mobileVerification,
            newPassword: this.loginForm.newPassword
          }
          accountFindPassword(obj).then(res => {
            if (res.code === 0) {
              this.$message({
                message: res.data,
                type: 'success'
              })
              this.$router.replace({
                path: '/login'
              })
            }
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
      margin: 0px auto 20px auto;
      text-align: center;
      font-weight: bold;
      color:#409EFF;
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
  .color{
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
  }
</style>
