<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="题目" prop="description" :error="formError.description" required>
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>
      <el-form-item label="标签" prop="tag" :error="formError.tag">
        <InputSelector v-model="form.tag" :multiple="true"/>
      </el-form-item>
      <el-form-item label="单选/多选" :error="formError.multiple">
        <el-switch
          v-model="isMultiple"
          :active-value="true"
          :inactive-value="false"
          active-text="多选"
          inactive-text="单选"
          disabled
        />
      </el-form-item>
      <el-form-item label="选项(换行分隔)" prop="choice" :error="formError.choice" required>
        <el-input v-model="form.choice" placeholder="一行一条选项" type="textarea" :rows="5" />
      </el-form-item>
      <el-form-item label="答案(逗号分隔)" prop="solution" :error="formError.solution" required>
        <el-input v-model="form.solution" placeholder="答案行号（从0开始），多个答案以逗号分割" />
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
import { getChoice, createChoice, updateChoice } from '@/api/problem'
import formMixin from '@/mixins/formMixin'
import InputSelector from '@/components/InputSelector'
export default {
  name: 'ChoiceDetail',
  components: {
    InputSelector
  },
  mixins: [formMixin],
  data() {
    return {
      id: this.$route.params.id,
      form: {
        description: '',
        difficulty: 1,
        tag: [],
        choice: '',
        solution: '',
        multiple: false,
      },
    }
  },
  computed: {
    isMultiple () {
      return this.form.solution.split(',').filter(Boolean).length > 1
    }
  },
  activated() {
    if (this.id) {
      this.getData()
    }
  },
  methods: {
    async getData() {
      const res = await getChoice(this.id)
      res.tag = res.tag.map(item => item.id)
      res.choice = JSON.parse(res.choice).join('\n')
      res.solution = JSON.parse(res.solution).join(',')
      this.form = res
    },
    async submitData() {
      const data = {
        description: this.form.description,
        tag: this.form.tag,
        difficulty: this.form.difficulty,
        choice: JSON.stringify(this.form.choice.split('\n').filter(Boolean)),
        solution: JSON.stringify(
          this.form.solution
            .split(',')
            .filter(Boolean)
            .map(Number),
        ),
        multiple: this.isMultiple
      }
      if (!this.id) {
        await createChoice(data)
        this.$message.success('创建成功')
      } else {
        await updateChoice(this.id)(data)
        this.$message.success('保存成功')
      }
      this.$router.go(-1)
    },
  },
}
</script>
