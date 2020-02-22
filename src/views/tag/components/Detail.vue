<template>
  <el-form ref="form" :model="form">
    <el-form-item label="知识点名称" prop="name" :error="formError.name" required>
      <el-input v-model="form.name" placeholder="输入知识点名称" />
    </el-form-item>
    <el-form-item label="对应课程" prop="course" :error="formError.course" required>
      <InputSelector v-model="form.course" :fetch-api="selectorApi" :allow-empty="false" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getCourses } from '@/api/course'
import { updateTag, createTag, getTag} from '@/api/tag'
import formMixin from '@/mixins/formMixin'
import InputSelector from '@/components/InputSelector'
export default {
  components: {
    InputSelector,
  },
  mixins: [formMixin],
  props: {
    // 传入tagid则为修改,不传入则为增加
    id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // course:courseId
      form: {
        name: '',
        course: undefined
      },
      selectorApi: getCourses,
    }
  },
  computed: {
    submitApi() {
      return this.id ? updateTag(this.id) : createTag
    },
  },
  watch: {
    id: {
      handler () {
        this.getTag()
      },
      immediate: true
    },
  },
  methods: {
    async getTag() {
      if (this.id) {
        const res = await getTag(this.id)
        this.form = res
        this.form.course = res.course.id
      }
    },
    async submitData() {
      const data = { name: this.form.name, course: this.form.course }
      await this.submitApi(data)
      this.$message.success('提交成功')
      this.$emit('fetch')
      this.$emit('close')
    },
  },
}
</script>
