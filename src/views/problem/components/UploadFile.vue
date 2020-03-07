<template>
  <div>
    <el-upload
      ref="upload"
      accept="text/xml,.xls,.xlsx"
      :action="destination"
      :file-list="fileList"
      :auto-upload="false"
      :multiple="true"
      :on-error="handleError"
      :on-success="handleSuccess"
      :with-credentials="true"
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
        选择题请上传xlsx文件,编程题请上传fps-xml文件，其余题目请使用新增功能，文件体积最大是10MB
      </div>
    </el-upload>
    <div class="count">
      <p>导入成功数：{{ successNum }}，导入失败数：{{ errorNum }}</p>
    </div>
    <div class="msg">
      <p v-for="(item,index) of msgList" :key="index" :class="[item.type === 'success'? successClass : errorClass]">
        {{item.file}}: {{ item.text }}
      </p>
    </div>
  </div>
</template>

<script>
import { downloadProblemTemplate } from '@/api/problem'
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
      msgList: [],
      successClass: 'success-msg',
      errorClass: 'error-msg'
    }
  },
  computed: {
    successNum () {
      return this.msgList.filter(msg => msg.type==='success').length
    },
    errorNum () {
      return this.msgList.filter(msg => msg.type==='error').length
    }
  },
  methods: {
    async downloadProblemTemplate() {
      await downloadProblemTemplate('题目模版.xls')
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleSuccess({success, error}, file) {
      const msg = {file: file.name}
      if(success) {
        msg.type="success"
        msg.text="导入成功"
      } else {
        msg.type="error"
        const errorText = Object.values(error)[0]
        msg.text=`上传成功，但是导入失败，服务器返回信息：${errorText}`
      }
      this.msgList.unshift(msg)
    },
    handleError(error, file) {
      const msg = {type:'error', text: '上传失败', file: file.name}
      this.msgList.unshift(msg)
    }
  },
}
</script>

<style lang="scss" scoped>
.msg {
  max-height: 300px;
  overflow: auto;
}
.count {
  p {
    color: silver;
  }
}
.success-msg {
  border:1px solid green;
  border-radius: 3px;
  background: rgb(218, 255, 218);
  padding: 3px;
  color: green;
}
.error-msg {
  border:1px solid red;
  border-radius: 3px;
  background: rgb(255, 227, 231);
  padding: 3px;
  color: red;
}
</style>
