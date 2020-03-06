<template>
  <div>
    <el-upload
      ref="upload"
      accept="text/xml,.xls,.xlsx"
      class="upload-demo"
      action="destination"
      :file-list="fileList"
      :auto-upload="false"
      :multiple="true"
      :http-request="uploadFile"
    >
      <el-button slot="trigger" size="small" type="primary" style="margin-right: 10px">
        选取文件
      </el-button>
      <el-button size="small" type="success" style="margin-right: 10px" @click="submitUpload">
        上传到服务器
      </el-button>
      <el-button size="small" @click="downloadProblemTemplate">
        下载客观题导入模版
      </el-button>
      <div slot="tip" class="el-upload__tip">
        选择题请上传xlsx文件,编程题请上传fps-xml文件，其余题目请使用新增功能
      </div>
    </el-upload>
  </div>
</template>

<script>
import { downloadProblemTemplate } from '@/api/problem'
import service from '@/utils/axios'
export default {
  name: 'UploadFile',
  props: {
    destination: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      fileList: [],
      formData: '',
    }
  },
  methods: {
    uploadFile(file) {
      this.formData.append('file', file.file)
    },
    async downloadProblemTemplate() {
      await downloadProblemTemplate('题目模版.xls')
    },
    submitUpload() {
      const h = this.$createElement
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      this.formData = new FormData()
      this.$refs.upload.submit()
      service
        .post(this.destination, this.formData, config)
        .then(({ success, error }) => {
          const msg = [
            h('h3', null, `导入问题成功数: ${success}`),
            h('h4', null, `错误情况如下：`),
          ]
          Object.entries(error).forEach(element => {
            msg.push(h('p', null, `${element[0]} : ${element[1]}`))
          })
          this.$alert(h('div', null, msg), '上传情况')
          this.$emit('fetch')
        })
        .catch(error => {
          console.log(this.fileList.length)
          this.$message.error('上传错误')
          console.table(error)
        })
      this.fileList = []
    },
  },
}
</script>
