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
        选择填空题请上传xlsx文件,编程题请上传fps-xml文件,其余题目请使用新增功能,文件体积最大是10MB
      </div>
    </el-upload>
    <div class="count">
      <p>上传成功数：{{ successNum }}, 上传失败数：{{ errorNum }}</p>
    </div>
    <div class="msg">
      <p v-for="(item,index) of msgList" :key="index" class="error-msg">
        {{item.file}}: {{ item.text }}
      </p>
    </div>
    <div class="table">
      <ImportTask />
    </div>
  </div>
</template>

<script>
import { downloadProblemTemplate } from '@/api/problem'
export default {
  name: 'UploadFile',
  components:{
    ImportTask: () => import('./ImportTask')
  },
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
      successNum: 0
    }
  },
  computed: {
    errorNum () {
      return this.msgList.length
    }
  },
  methods: {
    async downloadProblemTemplate() {
      await downloadProblemTemplate('题目模版.xls')
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleError(error, file) {
      const msg = {type:'error', text: '上传失败', file: file.name}
      this.msgList.unshift(msg)
    },
    handleSuccess() {
      this.successNum++
    }
  },
}
</script>

<style lang="scss" scoped>
.msg {
  max-height: 100px;
  overflow: auto;
}
.count {
  p {
    color: silver;
  }
}
.error-msg {
  border:1px solid red;
  border-radius: 3px;
  background: rgb(255, 227, 231);
  padding: 3px;
  color: red;
}
</style>
