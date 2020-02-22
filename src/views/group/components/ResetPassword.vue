<template>
  <el-form ref="form" label-position="left" label-width="100px" :model="form">
    <el-form-item label="学号" prop="username" :error="formError.username" required>
      <el-input v-model="form.username" placeholder="输入学号" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">
        重置该学生密码为学号
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { resetPassword } from '@/api/group'
import formMixin from '@/mixins/formMixin'
export default {
  mixins: [formMixin],
  props: {
    id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        username: '',
      },
    }
  },
  methods: {
    async submitData() {
      resetPassword(this.id)(this.form).then(_ => {
        this.$message.success('重置成功')
        this.resetForm()
        this.$emit('fetch')
        this.$emit('close', this.id ? 'edit' : 'add')
      }).catch( error => {
        this.$message.error(`密码重置失败, 学生可能不在此班级`)
        console.error(error)
      })
    },
  },
}
</script>
