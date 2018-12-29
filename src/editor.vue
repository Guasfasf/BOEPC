<template lang="html">

  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text">
    </div>
  </div>
</template>

<script>
  import E from 'wangeditor'
  let editor=null
  export default {
    name: 'Editorbar',
    data () {
      return {
        info_: null
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      isClear: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      isClear (val) {
        // 触发清除文本域内容
        if (val) {
          editor.txt.clear()
          this.info_ = null
        }
      },
      value (val) {
        // 使用 v-model 时,设置初始值
        editor.txt.html(val)
      }
    },
    mounted () {
      this.seteditor()
    },
    methods: {
      seteditor () {
        editor = new E(this.$refs.toolbar, this.$refs.editor)
        editor.customConfig.uploadImgShowBase64 = true // base 64 存储图片
        editor.customConfig.uploadImgServer = 'http://47.106.198.122/api/CanteenAdmin/CanteenManagement/UploadImage'// 配置服务器端地址
        editor.customConfig.uploadImgHeaders = {  'token':sessionStorage.getItem('token')    }// 自定义 header
        editor.customConfig.uploadFileName = 'image' // 后端接受上传文件的参数名
        editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
        editor.customConfig.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
        editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
        // this.editor.customConfig.uploadParams = {formFile:'2'};
        // 配置菜单
        editor.customConfig.menus = [
          'head',
          'bold', // 粗体
          'fontSize',
          'fontName',
          'italic',
          'underline', // 下划线
          'strikeThrough',
          'foreColor',
          'backColor',
          // 'link', // 插入链接
          // 'quote', // 引用
          // 'emoticon', // 表情
          // 'image', // 插入图片
          // 'table', // 表格
          // 'code', // 插入代码
          // 'fontSize',
          // 'head',
          // 'list',  // 列表
          // 'justify',  // 对齐方式
          // 'bold',
          // 'fontSize',  // 字号
          // 'italic',
          // 'underline',
          'image',  // 插入图片
          // 'foreColor',  // 文字颜色
          // 'undo',  // 撤销
          // 'redo',  // 重复
        ]

        editor.customConfig.uploadImgHooks = {
          fail: (xhr, editor, result) => {
            // 插入图片失败回调
          },
          success: (xhr, editor, result) => {
            // 图片上传成功回调
            //
            // let imgUrl = result.data;
            // insertImg(imgUrl)
          },
          timeout: (xhr, editor) => {
            // 网络超时的回调
          },
          error: (xhr, editor) => {
            console.log(editor)
            // 图片上传错误的回调
          },
          customInsert: (insertImg, result, editor) => {
            // 图片上传成功,插入图片的回调
            console.log(result);
            // if(result.code == 200){
            var url = result.data;
            insertImg(url)//将内容插入到富文本中
            // console.log(insertImg(url)+"DFDF")
            // console.log(data+"dsfd")
            // }
          }
        }

        editor.customConfig.onchange = (html) => {
          this.info_ = html // 绑定当前逐渐地值
          this.$emit('change', this.info_) // 将内容同步到父组件中
          console.log(this.info_ )
        }

        // 创建富文本编辑器
        editor.create()
      }
    }
  }
</script>

<style lang="css">
  .editor {
    width: 80%;
    margin-left: 4%;
    text-align: justify !important;
  }
  .toolbar {
    border: 1px solid #ccc;
  }
  .w-e-menu{
    z-index:1 !important;
  }
  .text {
    width:100%;
    border: 1px solid #ccc;
    height: 300px;
    text-align: justify !important;
  }
  table {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
  table td,
  table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
  }
  table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
  }

  /* blockquote 样式 */
  blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }

  /* code 样式 */
  code {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }
  pre code {
    display: block;
  }

  /* ul ol 样式 */
  ul, ol {
    margin: 10px 0 10px 20px;
  }
</style>
