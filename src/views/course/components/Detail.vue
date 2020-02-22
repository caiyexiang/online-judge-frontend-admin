<template>
  <el-form ref="form" label-position="left" label-width="100px" :model="form">
    <el-form-item label="课程名" prop="name" :error="formError.name" required>
      <el-input v-model="form.name"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {createCourse} from '@/api/course'
import formMixin from '@/mixins/formMixin'
export default {
  name: 'Detail',
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
        name: ''
      },
    }
  },
  methods: {
    async submitData() {
      await createCourse(this.form)
      this.$message.success('创建成功')
      this.resetForm()
      this.$emit('fetch')
      this.$emit('close', this.id ? 'edit' : 'add')
    }
  }
}
</script>
