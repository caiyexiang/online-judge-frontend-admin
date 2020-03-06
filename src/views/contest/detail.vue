<template>
  <div class="app-container">
    <!-- 遵从原样入，原样出的原则，尽量和api提供的数据命名/结构一致 -->
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item v-if="isContest" label="面向班级" prop="group" :error="formError.group">
        <InputSelector
          style="width:130px;"
          class="filter-item"
          v-model="form.group"
          :fetch-api="getGroups"
          placeholder="全部班级"
          @data="handleGroupChange"
        />
      </el-form-item>
      <el-form-item label="面向课程" prop="course" :error="formError.course">
        <span v-if="isContest">
          {{ form.course.name }}
        </span>
        <InputSelector v-else
          style="width:130px;"
          class="filter-item"
          v-model="form.course.id"
          :fetch-api="getCourses"
          placeholder="全部课程"
        />
      </el-form-item>
      <el-form-item label="标题" prop="title" :error="formError.title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="描述" prop="description" :error="formError.description">
        <el-input v-model="form.description" type="textarea" autosize />
      </el-form-item>
      <el-form-item v-if="isContest" label="开始时间" prop="begin_time" :error="formError.begin_time">
        <el-date-picker
          v-model="form.begin_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item v-if="isContest" label="结束时间" prop="end_time" :error="formError.end_time">
        <el-date-picker
          v-model="form.end_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择结束时间"
        />
      </el-form-item>
      <el-form-item v-if="isContest" label="实验状态" prop="private" :error="formError.private">
        <el-switch v-model="form.private" active-text="非公开" inactive-text="公开" />
      </el-form-item>
      <el-form-item v-if="isContest" label="代码分享" prop="code_share" :error="formError.code_share">
        <el-switch v-model="form.code_share" active-text="允许" inactive-text="不允许" />
      </el-form-item>
      <el-form-item v-if="isContest" label="实验类型" prop="is_exam" :error="formError.is_exam">
        <el-switch v-model="form.is_exam" active-text="考试" inactive-text="测验" />
      </el-form-item>
      <el-form-item label="题目列表" prop="problem_json" :error="formError.problems_score">
        <div class="button-group">
          <el-button size="mini" type="success" @click="openDialog('random')">
            随机出题
          </el-button>
          <el-button size="mini" type="primary" @click="handleAdd">
            + 添加题目
          </el-button>
          <el-button size="mini" type="primary" @click="openDialog('score')">
            分数助手
          </el-button>
        </div>
        <ProblemList />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          保存
        </el-button>
        <el-button v-if="isContest" type="success" @click="openDialog('preview')">
          预览试卷
        </el-button>
        <el-button v-if="route === 'EditContest'" @click="createTemplateFromContest">
          以此测验创建模板
        </el-button>
        <el-button v-if="route === 'EditTemplate'" type="primary" @click="createContestFromTemplate">
          以该模板创建测验
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="预览试卷" :visible.sync="dialogVisible.preview">
      <Preview  @close="dialogVisible.preview = false"/>
    </el-dialog>
    <el-dialog title="随机出题" :visible.sync="dialogVisible.random">
      <RandomSelect @close="dialogVisible.random = false"/>
    </el-dialog>
    <el-dialog title="分数助手" :visible.sync="dialogVisible.score">
      <ScoreHelper @close="dialogVisible.score = false"/>
    </el-dialog>
  </div>
</template>

<script>
/**
 *  目前detail有四种状态：contest/template edit/add
 *  还有一个引入状态
 */
import { mapGetters } from 'vuex'
import { getCourses } from '@/api/course'
import { getGroups, getGroup } from '@/api/group'
import {
  getContest,
  getContestTemplate,
  updateContest,
  updateContestTemplate,
  createContest,
  createContestTemplate,
} from '@/api/contest'
import { parseTime, getDefaultProblem, getDefaultScore } from '@/utils'
import { PROBLEM_ENUM, TYPE_LIST } from '@/utils/constant'
import formMixin from '@/mixins/formMixin'
import InputSelector from '@/components/InputSelector'
import Preview from './components/Preview'
import ProblemList from './components/ProblemList'
import RandomSelect from './components/RandomSelect'
import ScoreHelper from './components/ScoreHelper'

const { CODING, CHOICE, CODEFILL, FILLIN, QA } = PROBLEM_ENUM

const defaultForm = {
  title: '',
  description: '',
  course: {},
  group: undefined,
  private: true,
  code_share: false,
  is_template: false,
  begin_time: '',
  end_time: '',
  problems_score: '', // 提供给formError生成提示错误
  problems_id: '', // 提供给formError生成提示错误
  problem_json: getDefaultProblem(), //  目前仅供初始赋值用。{0: [{id,name,...}]} 提交时需提取problem_id {0: [id,id,id]}
  problem_score_json: getDefaultScore(), // {0:{1:34,2:33,3:33}} => { TYPE: {PID: score} } 提交时需名字更改成 problems_score
}

const fetchApi = {
  EditContest: getContest,
  AddContest: getContest,
  EditTemplate: getContestTemplate,
  AddTemplate: getContestTemplate,
}
export default {
  name: 'ContestDetail',
  components: {
    Preview,
    ProblemList,
    InputSelector,
    RandomSelect,
    ScoreHelper
  },
  mixins: [formMixin],
  data() {
    return {
      id: this.$route.params.id,
      dialogVisible: {
        preview: false,
        random: false,
        score: false,
      },
      form: defaultForm,
      submitApi: {
        EditContest: updateContest(this.$route.params.id),
        AddContest: createContest,
        EditTemplate: updateContestTemplate(this.$route.params.id),
        AddTemplate: createContestTemplate,
      },
      getCourses,
      getGroups,
    }
  },
  computed: {
    ...mapGetters(['problems', 'problems_score', 'userid']),
    isContest() {
      return this.$route.name === 'EditContest' || this.$route.name === 'AddContest'
    },
    fromTemplate() {
      return this.$route.query.template
    },
    route() {
      return this.$route.name
    },
  },
  activated() {
    // 一个决定是否要重新加载数据的flag, 当从ProblemSelect页面回来当时候就不重新加载数据了
    if (!this.$store.getters.load_flag) {
      this.$store.commit('problem/SET_LOAD_FLAG', true)
      return
    }
    // 从模版导入创建
    if (this.fromTemplate) {
      this.handleTemplateImport()
      return
    }
    // 编辑页面
    if (this.route === 'EditContest' || this.route === 'EditTemplate') {
      this.getData()
      return
    }
    // 新增页面
    this.form = defaultForm
    this.$store.commit('problem/RESET_PROBLEMS')
    this.$store.commit('problem/RESET_PROBLEMS_SCORE')
  },
  methods: {
    getData() {
      fetchApi[this.route](this.id).then(res => {
        if (this.isContest) {
          res.begin_time = parseTime(res.begin_time)
          res.end_time = parseTime(res.end_time)
        }
        this.form = res
        this.$store.commit('problem/SET_PROBLEMS', this.form.problem_json)
        this.$store.commit('problem/SET_PROBLEMS_SCORE', this.form.problem_score_json)
      })
    },
    async submitData() {
      const problems_id = {}
      for (const key of TYPE_LIST) {
        problems_id[key] = this.problems[key].map(item => item.id)
      }
      const data = {
        title: this.form.title,
        course: this.form.course.id,
        description: this.form.description,
        problems_id: JSON.stringify(problems_id),
        problems_score: JSON.stringify(this.problems_score),
      }
      if (this.isContest) {
        Object.assign(data, {
          group: this.form.group,
          private: this.form.private,
          code_share: this.form.code_share,
          is_template: this.form.is_template,
          begin_time: this.form.begin_time,
          end_time: this.form.end_time,
        })
      } else {
        Object.assign(data, { user: this.userid })
      }
      await this.submitApi[this.route](data)
      this.fromTemplate ? this.$router.push({ name: 'Contest' }) : this.$router.go(-1)
      this.$message.success('修改成功')
    },
    handleTemplateImport() {
      getContestTemplate(this.fromTemplate).then(res => {
        this.form = res
        this.$store.commit('problem/SET_PROBLEMS', this.form.problem_json)
        this.$store.commit('problem/SET_PROBLEMS_SCORE', this.form.problem_score_json)
      })
    },
    openDialog(name) {
      this.dialogVisible[name] = true
    },
    handleAdd () {
      this.$store.commit('problem/SET_LOAD_FLAG', false)
      this.$router.push({name: 'ProblemSelect'})
    },
    handleGroupChange (data) {
      this.form.course = data.course
    },
    createTemplateFromContest() {
      createContestTemplate({
        contest_id: this.form.id,
      }).then(res => {
        this.$router.push({ name: 'Template' })
        this.$message.success('创建成功')
      })
    },
    createContestFromTemplate() {
      this.$router.push({ name: 'AddContest', query: { template: this.id } })
    },
  },
}
</script>
