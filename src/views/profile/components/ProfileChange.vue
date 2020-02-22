<template>
  <el-card class="card">
    <el-form
    ref="form"
    :model="form"
    status-icon
    :rules="rules"
    label-width="100px"
    class="demo-passwordForm"
  >
    <el-form-item
      label="密码"
      prop="NewPassword"
      :error="formError.password"
    >
      <el-input
        v-model="form.NewPassword"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item
      label="确认密码"
      prop="RepeatPassword"
    >
      <el-input
        v-model="form.RepeatPassword"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="submitForm"
      >
        修改密码
      </el-button>
      <el-button @click="resetForm">
        重置
      </el-button>
    </el-form-item>
  </el-form>
  </el-card>
</template>

<script>
import { changePassword } from '@/api/user'
import formMixin from '@/mixins/formMixin'
export default {
  mixins: [formMixin],
  data () {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.RepeatPassword !== '') {
          this.$refs.form.validateField('RepeatPassword')
        }
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.NewPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        OldPassword: '',
        NewPassword: '',
        RepeatPassword: '',
        password: ''
      },
      rules: {
        NewPassword: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        RepeatPassword: [
          { validator: validatePassword2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async submitData () {
      const data = { password: this.form.NewPassword }
      await changePassword(data)
      this.$success('修改密码成功! 请重新登陆! ')
      this.resetForm()
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  width: 80%;
  margin-left: 10px;
}
</style>