<template>
  <el-form ref="form" :model="form" label-width="150px">
    <el-form-item label="名称" prop="name" :error="formError.name" required>
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="查重问题" prop="problem" :error="formError.problem" required>
      <el-input v-model="form.problem" type="textarea" :rows="2" placeholder="每个问题ID之间以逗号(,)相隔" />
    </el-form-item>
    <el-form-item label="文件相似度" prop="td" :error="formError.td">
      <el-input-number v-model="form.td" :max="100" :min="0" />
      <p>两文件超过此相似度时会生成记录</p>
    </el-form-item>
    <el-form-item label="单行相似度" prop="tr" :error="formError.tr">
      <el-input-number v-model="form.tr" :max="100" :min="0" />
      <p>两文件中的行相似度超过此阈值时会认为两行相同</p>
    </el-form-item>
    <el-form-item label="查重开始时间" prop="submission_start_time" :error="formError.submission_start_time" required>
      <el-date-picker
        v-model="form.submission_start_time"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择开始时间"
      />
    </el-form-item>
    <el-form-item label="查重结束时间" prop="submission_end_time" :error="formError.submission_end_time" required>
      <el-date-picker
        v-model="form.submission_end_time"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择结束时间"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { createCodeCheckTask } from '@/api/code-check'
import formMixin from '@/mixins/formMixin'
export default {
  mixins: [formMixin],
  data() {
    return {
      form: {
        name: '',
        problem: '',
        td: 70,
        tr: 80,
        submission_end_time: '',
        submission_start_time: ''
      },
    }
  },
  methods: {
    async submitData() {
      await createCodeCheckTask(this.form)
      this.$message.success('提交成功')
      this.resetForm()
      this.$emit('fetch')
      this.$emit('close', 'detail')
    },
  },
}
</script>
