<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="题目" prop="description" :error="formError.description" required>
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>
      <el-form-item label="标签" prop="tag" :error="formError.tag">
        <InputSelector v-model="form.tag" :multiple="true" />
      </el-form-item>
      <el-form-item label="答案(换行分隔)" prop="solution" :error="formError.solution" required>
        <el-input v-model="form.solution" type="textarea" :row="5" placeholder="一行一个答案" />
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
import { getFillIn, createFillIn, updateFillIn } from '@/api/problem'
import formMixin from '@/mixins/formMixin'
import InputSelector from '@/components/InputSelector'
export default {
  name: 'FillInDetail',
  components: {
    InputSelector,
  },
  mixins: [formMixin],
  data() {
    return {
      id: this.$route.params.id,
      form: {
        description: '',
        difficulty: 1,
        tag: [],
        solution: '',
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
      const res = await getFillIn(this.id)
      res.tag = res.tag.map(item => item.id)
      res.solution = JSON.parse(res.solution).join('\n')
      this.form = res
    },
    async submitData() {
      const data = {
        description: this.form.description,
        tag: this.form.tag,
        difficulty: this.form.difficulty,
        solution: JSON.stringify(this.form.solution.split('\n')),
      }
      if (!this.id) {
        await createFillIn(data)
        this.$message.success('创建成功')
      } else {
        await updateFillIn(this.id)(data)
        this.$message.success('保存成功')
      }
      this.$router.go(-1)
    },
  },
}
</script>
