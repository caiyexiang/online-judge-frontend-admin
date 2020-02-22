<template>
  <div class="app-container">
    <div class="info-card">
      <p>考试模式开启后，普通用户只能在考试时间段内登录，首次登陆后会记录IP，考试期间前后IP不一致则会拒绝登录。</p>
    </div>
    <el-card style="margin-bottom:10px">
      <h4>释放被封锁ip的用户</h4>
      <div>
        <el-input
          v-model="resetUser"
          class="ip-input"
          placeholder="输入要释放IP的学号"
        />
        <el-button
          type="primary"
          @click="resetIP"
        >
          释放
        </el-button>
      </div>
    </el-card>
    <el-card>
      <h4>设置考试模式 (考场 {{ id }})</h4>
      <el-form
        ref="form"
        :model="form"
      >
        <el-form-item
          label="考试模式"
          prop="examMode"
          :error="formError.examMode"
          required
        >
          <el-switch
            v-model="form.examMode"
            :active-value="true"
            :inactive-value="false"
            active-text="启动"
            inactive-text="关闭"
          />
        </el-form-item>
        <el-form-item
          label="考试开始时间"
          prop="examStartTime"
          :error="formError.examStartTime"
          required
        >
          <el-date-picker
            v-model="form.examStartTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间"
          />
        </el-form-item>
        <el-form-item
          label="考试结束时间"
          prop="examEndTime"
          :error="formError.examEndTime"
          required
        >
          <el-date-picker
            v-model="form.examEndTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm"
          >
            设置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getExamMode, resetIp, updateExamMode} from '@/api/exam-mode'
import { parseTime } from '@/utils/index'
import formMixin from '@/mixins/formMixin'
export default {
  name: 'ExamMode',
  mixins: [formMixin],
  data () {
    return {
      resetUser: '',
      id: 1,
      form: {
        examMode: false,
        examStartTime: '',
        examEndTime: ''
      }
    }
  },
  activated () {
    this.getExam()
  },
  methods: {
    resetIP () {
      resetIp(this.resetUser).then(res => {
        this.$message.success(`成功释放用户 ${this.resetUser} 的IP锁`)
      }).catch(err => {
        this.$message.error('释放失败')
        console.table(err)
      })
    },
    getExam () {
      getExamMode(this.id).then(res => {
        this.form.examMode = res.exam_mode
        this.form.examStartTime = parseTime(res.exam_start_time)
        this.form.examEndTime = parseTime(res.exam_end_time)
      })
    },
    submitData () {
      const data = {
        exam_mode: this.form.examMode,
        exam_start_time: this.form.examStartTime,
        exam_end_time: this.form.examEndTime
      }
      updateExamMode(this.id)(data).then(res => {
        this.$message.success(`考场 ${this.id} 考试模式设置成功`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ip-input {
  width: 30%;
}
.info-card {
  margin: 10px 0;
  background: rgb(252, 232, 204);
  border-left: 10px solid #e6a23c;
  color: #9b6d27;
  padding: 10px 10px;
}
</style>
