<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="110px">
      <el-form-item label="标题" prop="title" :error="formError.title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="时间限制" prop="timeLimit" :error="formError.time_limit">
        <el-input v-model="form.time_limit">
          <template slot="append">
            秒
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="内存限制" prop="memoryLimit" :error="formError.memory_limit">
        <el-input v-model="form.memory_limit">
          <template slot="append">
            MB
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tag" :error="formError.tag">
        <InputSelector v-model="form.tag" :multiple="true" />
      </el-form-item>
      <el-form-item label="描述" prop="description" :error="formError.description">
        <quill-editor ref="detailEditor" v-model="form.description" :options="editorOption" />
      </el-form-item>
      <el-form-item label="代码模板" prop="code_template" :error="formError.code_template">
        <CodeMirror :value.sync="form.code_template" :auto-focus="false" :language.sync="form.language" />
      </el-form-item>
      <el-form-item label="输入" prop="input" :error="formError.input">
        <quill-editor ref="detailEditor" v-model="form.input" :options="editorOption" />
      </el-form-item>
      <el-form-item label="输出" prop="output" :error="formError.output">
        <quill-editor ref="detailEditor" v-model="form.output" :options="editorOption" />
      </el-form-item>
      <el-form-item label="提示" prop="hint" :error="formError.hint">
        <quill-editor ref="hintEditor" v-model="form.hint" :options="editorOption" />
      </el-form-item>
      <el-form-item
        v-for="index in sampleLength"
        :key="`sample${index}`"
        :label="`示例数据第${index}组`"
        :prop="`sample${index}`"
        class="data-container"
      >
        <el-input
          v-model="form.sample_input_json[index - 1]"
          type="textarea"
          autosize
          placeholder="输入"
          class="data-input"
        />
        <el-input
          v-model="form.sample_output_json[index - 1]"
          type="textarea"
          autosize
          placeholder="输出"
          class="data-input"
        />
        <el-button
          class="remove-data-btn"
          type="danger"
          icon="el-icon-delete"
          circle
          @click="removeSampleData(index)"
        />
      </el-form-item>
      <div class="add-data-btn-container">
        <el-button type="success" class="add-data-btn" plain @click="addNewSampleData">
          <i class="el-icon-plus" />添加新示例数据
        </el-button>
      </div>
      <el-form-item
        v-for="index in testLength"
        :key="`test${index}`"
        :label="`测试数据第${index}组`"
        :prop="`test${index}`"
        class="data-container"
      >
        <el-input
          v-model="form.test_input_json[index - 1]"
          type="textarea"
          autosize
          placeholder="输入"
          class="data-input"
        />
        <el-input
          v-model="form.test_output_json[index - 1]"
          type="textarea"
          autosize
          placeholder="输出"
          class="data-input"
        />
        <el-button class="remove-data-btn" type="danger" icon="el-icon-delete" circle @click="removeTestData(index)" />
      </el-form-item>
      <div class="add-data-btn-container">
        <el-button type="success" class="add-data-btn" plain @click="addNewTestData">
          <i class="el-icon-plus" />添加新测试数据
        </el-button>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCodeFill, createCodeFill, updateCodeFill } from '@/api/problem'
import formMixin from '@/mixins/formMixin'
import InputSelector from '@/components/InputSelector'
import { quillEditor } from 'vue-quill-editor'
import CodeMirror from '@/components/CodeMirror'
import 'quill/dist/quill.snow.css'
export default {
  name: 'CodeFillDetail',
  components: {
    quillEditor,
    InputSelector,
    CodeMirror,
  },
  mixins: [formMixin],
  data() {
    return {
      id: this.$route.params.id,
      editorOption: {},
      form: {
        title: '',
        time_limit: '',
        memory_limit: '',
        description: '',
        code_template: '',
        language: 'c',
        input: '',
        output: '',
        solution: '',
        hint: '',
        difficulty: 1,
        source: '',
        add_date: '',
        number_submission: 0,
        number_accepted: 0,
        tag: [],
        sample_input_json: [],
        sample_output_json: [],
        test_input_json: [],
        test_output_json: [],
      },
    }
  },
  computed: {
    sampleLength() {
      return this.form.sample_input_json.length > this.form.sample_output_json.length
        ? this.form.sample_input_json.length
        : this.form.sample_output_json.length
    },
    testLength() {
      return this.form.test_input_json.length > this.form.test_output_json.length
        ? this.form.test_input_json.length
        : this.form.test_output_json.length
    },
  },
  activated() {
    if (this.id) {
      this.getData()
    }
  },
  methods: {
    addNewSampleData() {
      this.form.sample_input_json.push('')
      this.form.sample_output_json.push('')
    },
    addNewTestData() {
      this.form.test_input_json.push('')
      this.form.test_output_json.push('')
    },
    removeSampleData(index) {
      if (this.form.sample_input_json[index - 1].length > 0 || this.form.sample_output_json[index - 1].length > 0) {
        this.$confirm('该样例数据有一定长度, 是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.form.sample_input_json.splice(index - 1, 1)
            this.form.sample_output_json.splice(index - 1, 1)
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
          })
          .catch(() => {})
      } else {
        this.form.sample_input_json.splice(index - 1, 1)
        this.form.sample_output_json.splice(index - 1, 1)
      }
    },
    removeTestData(index) {
      if (this.form.test_input_json[index - 1].length > 0 || this.form.test_output_json[index - 1].length > 0) {
        this.$confirm('该测试数据有一定长度, 是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.form.test_input_json.splice(index - 1, 1)
            this.form.test_output_json.splice(index - 1, 1)
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
          })
          .catch(() => {})
      } else {
        this.form.test_input_json.splice(index - 1, 1)
        this.form.test_output_json.splice(index - 1, 1)
      }
    },
    async getData() {
      const res = await getCodeFill(this.id)
      res.tag = res.tag.map(item => item.id)
      this.form = res
    },
    async submitData() {
      const data = {
        title: this.form.title,
        time_limit: this.form.time_limit,
        memory_limit: this.form.memory_limit,
        description: this.form.description,
        code_template: this.form.code_template,
        input: this.form.input,
        output: this.form.output,
        hint: this.form.hint,
        tag: this.form.tag,
        language: this.form.language,
        solution: this.form.solution,
        difficulty: this.form.difficulty,
        source: this.form.source,
        sample_input: JSON.stringify(this.form.sample_input_json),
        sample_output: JSON.stringify(this.form.sample_output_json),
        test_input: JSON.stringify(this.form.test_input_json),
        test_output: JSON.stringify(this.form.test_output_json),
      }
      if (!this.id) {
        await createCodeFill(data)
        this.$message.success('创建成功')
      } else {
        await updateCodeFill(this.id)(data)
        this.$message.success('保存成功')
      }
      this.$router.go(-1)
    },
  },
}
</script>

<style>
.ql-toolbar {
  line-height: 24px;
}
.data-input {
  margin-bottom: 5px;
}
.add-data-btn {
  width: 100%;
}
.add-data-btn-container {
  margin-bottom: 10px;
  padding-left: 110px;
}
.remove-data-btn {
  position: absolute;
  display: none;
  top: 40px;
  left: -75px;
  z-index: 20;
}
.data-container:hover .remove-data-btn {
  display: block;
}
</style>
