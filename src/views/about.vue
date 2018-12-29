<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>内容</span>
      </div>
      <tinymce ref="editor" :height="400" v-model="content" />
      <div id="editor"/>
    </el-card>
    <el-form
      :inline="true"
      class="demo-form-inline"
      size="mini"
      label-position="right"
      label-width="150px"
    >
      <el-form-item style="text-align: center;">
        <el-button @click="back">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { messageAdd, messageCheck, messageUpdate } from '@/api/users'
export default {
  components: {
    Tinymce
  },
  data() {
    return {
      content: '',
      id: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const params = {
        formData: {},
        pageData: {
          currentPage: 0,
          pageSize: 20
        }
      }
      messageCheck(params).then(res => {
        console.log(res)
        this.content = res.data.list[0].message
        this.id = res.data.list[0].id
      })
    },
    handleAvatarSuccess(res, file) {
      this.flight.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    back() {
      this.$router.back()
    },
    submit() {
      if (!this.content) {
        alert('保存失败，填写内容为空')
        return false
      }
      this.listLoading = true
      if (this.id) {
        const obj = {
          id: this.id,
          message: this.content
        }
        messageUpdate(obj).then(res => {
          this.listLoading = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
      } else {
        const params = {
          message: this.content
        }
        messageAdd(params).then(res => {
          this.listLoading = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        })
      }
    }
  }
}
</script>
