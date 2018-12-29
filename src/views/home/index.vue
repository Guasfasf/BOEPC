<template>
  <div class="dashboard-container">
    <h1 style="text-align: center;">
      欢迎登录BOE
    </h1>
    <div class="box">
      <div class="boxDiv">
        <span class="title">每日活跃用户数量 {{ tian }}</span>
      </div>
      <div class="boxDiv">
        <span class="title">每月活跃用户数量 {{ yue }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dayCount, monthCount } from '@/api/public'

export default {
  name: 'Home',
  data() {
    return {
      tian: '',
      yue: ''
    }
  },
  computed: {
    ...mapGetters([
      'currentUser',
      'roles'
    ])
  },
  created() {
    this.date()
    this.mouth()
  },
  methods: {
    date() {
      const par = {
        formData: {
          id: ''
        },
        pageData: {
          currentPage: 0,
          pageSize: 20
        }
      }
      dayCount(par).then(res => {
        this.tian = res.data
      })
    },
    mouth() {
      const par = {
        formData: {
          id: ''
        },
        pageData: {
          currentPage: 0,
          pageSize: 20
        }
      }
      monthCount(par).then(res => {
        this.yue = res.data
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
  .box{
    /*margin:150px auto;*/
    width: 100%;
    /*text-align: center;*/
    position: absolute;
    bottom:50px;
    left:50px;
    .boxDiv{
      display: flex;
      flex-direction:column;
      .title{
        font-size: 30px;
        margin-top:80px;
      }
    }
  }
</style>
