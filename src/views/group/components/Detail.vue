<template>
  <div>
    <el-form ref="form" :model="form" v-loading="loading">
      <el-form-item label="班级名称" prop="name" :error="formError.name" required>
        <el-input v-model="form.name" placeholder="输入班级名称" />
      </el-form-item>
      <el-form-item label="所属课程" prop="course" :error="formError.course" required>
        <InputSelector v-model="form.course" :fetch-api="courseApi" />
      </el-form-item>
      <el-form-item label="老师" prop="teacher" :error="formError.teacher">
        <InputSelector
          v-model="form.teacher"
          :fetch-api="teacherApi"
          :process-func="
            item => {
              return { value: item.username, label: item.username }
            }
          "
          :fetch-params="teacherParams"
          :multiple="true"
          :allow-empty="false"
        />
      </el-form-item>
      <el-form-item label="助教" prop="assistant" :error="formError.assistant">
        <el-input v-model="form.assistant" type="textarea" :rows="5" placeholder="一行一个ID/学号" />
      </el-form-item>
      <el-form-item label="学生" prop="users" :error="formError.users">
        <el-input v-model="form.users" type="textarea" :rows="5" placeholder="一行一个ID/学号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getGroup, updateGroup, createGroup } from '@/api/group'
import { getCourses, createCourse } from '@/api/course'
import { getUsers } from '@/api/user'
import formMixin from '@/mixins/formMixin'
import InputSelector from '@/components/InputSelector'
export default {
  components: {
    InputSelector
  },
  mixins: [formMixin],
  props: {
    // 传入groupId则为修改,不传入则为增加
    id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        name: '',
        teacher: [],
        users: '',
        assistant: '',
        course: undefined,
      },
      dataApi: getGroup,
      courseApi: getCourses,
      teacherApi: getUsers,
      teacherParams: { permission: 1 },
      loading: false
    }
  },
  computed: {
    submitApi() {
      return this.id ? updateGroup(this.id) : createGroup
    },
  },
  watch: {
    id: {
      handler() {
        this.getData()
      },
      immediate: true
    }
  },
  methods: {
    async getData() {
      this.loading = true
      if (this.id) {
        const res = await getGroup(this.id)
        res.course = res.course.id
        res.teacher = res.teacher.map(item => item.username)
        res.users = res.users.map(item => item.username).join('\r\n')
        res.assistant = res.assistant.map(item => item.username).join('\r\n')
        this.form = res
      }
      this.loading = false
    },
    async submitData() {
      const users = this.form.users
        .split(/\s+/g)
        .map(item => item.trim())
        .filter(Boolean)
      const assistant = this.form.assistant
        .split(/\s+/g)
        .map(item => item.trim())
        .filter(Boolean)
      const data = {
        users,
        assistant,
        teacher: this.form.teacher,
        name: this.form.name,
        course: this.form.course,
      }
      await this.submitApi(data)
      this.$message.success('提交成功')
      this.resetForm()
      this.$emit('fetch')
      this.$emit('close', this.id ? 'edit' : 'add')
    },
  },
}
</script>
