<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="110px">
      <el-form-item label="题目" prop="description" :error="formError.description">
        <quill-editor ref="problemEditor" v-model="form.description" :options="{}" />
      </el-form-item>
      <el-form-item label="标签" prop="tag" :error="formError.tag">
        <InputSelector v-model="form.tag" :multiple="true" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getQA, createQA, updateQA } from '@/api/problem'
import formMixin from '@/mixins/formMixin'
import InputSelector from '@/components/InputSelector'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
export default {
  name: 'QADetail',
  components: {
    InputSelector,
    quillEditor,
  },
  mixins: [formMixin],
  data() {
    return {
      id: this.$route.params.id,
      form: {
        description: '',
        difficulty: 1,
        tag: [],
      },
    }
  },
  activated() {
    if (this.id) {
      this.getData()
    }
  },
  methods: {
    async getData() {
      const res = await getQA(this.id)
      res.tag = res.tag.map(item => item.id)
      this.form = res
    },
    async submitData() {
      const data = {
        description: this.form.description,
        tag: this.form.tag,
        difficulty: this.form.difficulty,
      }
      if (!this.id) {
        await createQA(data)
        this.$message.success('创建成功')
      } else {
        await updateQA(this.id)(data)
        this.$message.success('保存成功')
      }
      this.$router.go(-1)
    },
  },
}
</script>
