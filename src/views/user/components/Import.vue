<template>
  <el-form ref="form" :inline="true" label-position="left" label-width="100px" :model="form">
    <p>左边输入学号，右边输入姓名，换行分隔</p>
    <el-form-item prop="username" :error="formError.username" required>
      <el-input v-model="form.username" placeholder="学号" type="textarea" :rows="5" />
    </el-form-item>
    <el-form-item prop="name" :error="formError.name">
      <el-input v-model="form.name" placeholder="姓名" type="textarea" :rows="5" />
    </el-form-item>
    <div>
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          提交
        </el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import formMixins from '@/mixins/formMixin'
import { createUsers } from '@/api/user'
export default {
  mixins: [formMixins],
  data() {
    return {
      form: {
        username: '',
        name: '',
      },
    }
  },
  methods: {
    async submitData() {
      let userList = this.form.username
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean)
      let nameList = this.form.name
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean)
      let data = { username: userList, name: nameList }
      const res = await createUsers(data)
      this.$message.success('导入成功')
      this.resetForm()
      this.$emit('fetch')
      this.$emit('close', 'import')
    },
  },
}
</script>
