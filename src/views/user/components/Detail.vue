<template>
  <el-form ref="form" label-position="left" label-width="100px" :model="form">
    <el-form-item label="账户ID/学号" prop="username" :error="formError.username" required>
      <el-input v-model="form.username" :disabled="Boolean(id)" />
    </el-form-item>
    <!-- 创建老师时只要一行用户名，涉及到后端api -->
    <el-form-item v-if="!createTeacher" label="姓名" prop="name" :error="formError.name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item v-if="!createTeacher" label="昵称" prop="nickname" :error="formError.nickname">
      <el-input v-model="form.nickname" />
    </el-form-item>
    <div v-if="!id">密码默认为账户ID/学号</div>
    <el-form-item>
      <el-button type="primary" @click="submitForm">
        提交
      </el-button>
    </el-form-item>
    <el-button v-if="id" type="primary" @click="resetPassword">
      重置密码为账户ID/学号
    </el-button>
  </el-form>
</template>

<script>
import { getUser, createTeacher, createUser, patchUser, resetPassword } from '@/api/user'
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
      dataApi: getUser,
      form: {
        id: 0,
        username: '',
        name: '',
        nickname: '',
      },
    }
  },
  computed: {
    submitApi() {
      return this.id ? patchUser(this.id) : createUser
    },
    createTeacher() {
      return !this.id && this.$route.name === 'Teacher'
    },
  },
  watch: {
    id: {
      handler(val) {
        this.getData()
      },
      immediate: true,
    },
  },
  methods: {
    async getData() {
      if (this.id) {
        const res = await this.dataApi(this.id)
        this.form = res
      }
    },
    async submitData() {
      if (this.createTeacher) {
        const data = { teachers: [this.form.username] }
        await createTeacher(data)
      } else {
        const { name, username, nickname } = this.form
        const data = { name, username, nickname }
        await this.submitApi(data)
      }
      this.$message.success('提交成功')
      this.resetForm()
      this.$emit('fetch')
      this.$emit('close', this.id ? 'edit' : 'add')
    },
    async resetPassword() {
      try {
        await resetPassword(this.id)
        this.$message.success(`重设用户 ${this.form.username} 的密码成功！`)
      } catch (e) {
        this.$message.error(e)
      }
    },
  },
}
</script>
