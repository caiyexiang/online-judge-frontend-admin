<template>
  <el-container class="container" v-loading="loading">
    <el-aside class="aside">
      <ExportWord :problems="problems" :user="userId" :contestId="contest" />
      <el-form>
        <el-form-item v-for="type of types" :key="type" :error="formError[type2score[type]]">
          <div v-if="problems[type] && problems[type].length">
            <p>{{ PROBLEM_TYPE_CN[type] }}</p>
            <el-row v-for="(problem, index) of problems[type]" :key="`${type} - ${problem.id}`">
              <el-button
                type="primary"
                style="width:50px;"
                :plain="!plainState(type, index)"
                @click="switchProblem(type, index)"
              >
                {{ index + 1 }}
              </el-button>
              <el-input-number
                v-model="problem.score"
                class="score-input"
                placeholder="得分"
                :max="problem.maxScore"
                :min="0"
                :step="1"
              />
              <span> （{{ problem.maxScore }} 分） </span>
            </el-row>
          </div>
        </el-form-item>
      </el-form>
      <el-button class="submit" type="success" @click="submitReview">
        {{ '提交批阅' }}
      </el-button>
    </el-aside>
    <el-main>
      <components
        :is="currentComponent"
        :key="`${currentType}-${currentIndex}`"
        :problem="currentProblem"
        :index="currentIndex + 1"
      />
    </el-main>
  </el-container>
</template>

<script>
/**
 * 目前决定codefill复用code的组件，因为后台保存的是它的代码，不含分隔符
 */
import Coding from '@/components/Question/Coding'
import Qa from '@/components/Question/QA'
import Choice from '@/components/Question/Choice'
import FillIn from '@/components/Question/FillIn'
import { FormError } from '@/utils/error'
import { PROBLEM_ENUM, PROBLEM_TYPE_CN } from '@/utils/constant.js'
import ExportWord from './components/ExportWord'
import {
  getSubmissions,
  getSubmission,
  getCodeFillSubmissions,
  getCodeFillSubmission,
  getContestSubmission,
  getQASubmission,
  updateContestSubmission,
} from '@/api/submission'
import { getContest } from '@/api/contest'
const { CODING, CHOICE, FILLIN, CODEFILL, QA } = PROBLEM_ENUM
const type2component = {
  [CODING]: 'Coding',
  [CODEFILL]: 'Coding',
  [QA]: 'Qa',
  [CHOICE]: 'Choice',
  [FILLIN]: 'FillIn',
}
const type2score = {
  [CODING]: 'coding_score',
  [CHOICE]: 'choice_score',
  [FILLIN]: 'fill_in_score',
  [CODEFILL]: 'code_fill_score',
  [QA]: 'qa_score',
}
export default {
  name: 'EditReview',
  components: {
    Coding,
    Qa,
    Choice,
    FillIn,
    ExportWord,
  },
  data() {
    return {
      id: Number(this.$route.params.submission),
      title: '2016150001 - C语言测验 批阅',
      contest: Number(this.$route.params.contest),
      problems: { [CODING]: [], [CHOICE]: [], [FILLIN]: [], [CODEFILL]: [], [QA]: [] },
      loading: true,
      scores: { [CODING]: [], [CHOICE]: [], [FILLIN]: [], [CODEFILL]: [], [QA]: [] },
      choiceSubmission: {},
      fillInSubmission: {},
      formError: { coding_score: '', choice_score: '', fill_in_score: '', code_fill_score: '', qa_score: '' },
      totalScore: 0,
      userId: 0,
      username: '',
      currentIndex: 0,
      currentType: CODING,
      // 调节此数组可以调节侧边栏显示顺序 [CHOICE, FILLIN, CODING, CODEFILL, QA]
      types: [CHOICE, FILLIN, CODING, CODEFILL, QA],
      PROBLEM_TYPE_CN,
      type2score,
      getSubmissionsApi: {
        [CODING]: getSubmissions,
        [CODEFILL]: getCodeFillSubmissions,
      },
      getSubmissionDetailApi: {
        [CODING]: getSubmission,
        [CODEFILL]: getCodeFillSubmission,
        [QA]: getQASubmission,
      },
    }
  },
  computed: {
    currentProblem() {
      return this.problems[this.currentType][this.currentIndex]
    },
    currentComponent() {
      return type2component[this.currentType]
    },
  },
  async created() {
    this.loading = true
    await this.fetchSubmission()
    await this.fetchContest()
    this.loading = false
    // 自动选择
    for (const type of this.types) {
      if (this.problems[type].length > 0) {
        this.currentType = type
        break
      }
    }
    this.currentIndex = 0
  },
  methods: {
    async fetchSubmission() {
      try {
        const res = await getContestSubmission(this.id)
        for (const type of Object.values(PROBLEM_ENUM)) {
          this.scores[type] = JSON.parse(res[type2score[type]])
        }
        this.choiceSubmission = JSON.parse(res.choice_submission)
        this.fillInSubmission = JSON.parse(res.fill_in_submission)
        this.totalScore = res.totalScore
        this.userId = res.user
      } catch (err) {
        console.log(err)
      }
    },
    async fetchContest() {
      try {
        const res = await getContest(this.contest)
        this.title = `${this.userId} - ${res.title} 题目批阅`
        const problems = res.problem_json
        for (const type of this.types) {
          if (!problems[type]) problems[type] = []
        }
        const codeSubmissionParams = {
          limit: 1,
          user: this.userId,
          contest: this.contest,
        }
        // debug中，之后会合并所有的问题解析。
        for (const type of [CODING, CODEFILL]) {
          for (const item of problems[type]) {
            item.status = '没有提交'
            item.type = type
            item.submissionId = -1
            item.demoInput = item.sample_input_json.join('').replace(/\\n/g, '<br/>')
            item.demoOutput = item.sample_output_json.join('').replace(/\\n/g, '<br/>')
            item.maxScore = res.problem_score_json[type][item.id] || 100
            item.output = ''
            const codeSubmissions = await this.getSubmissionsApi[type](
              Object.assign({}, codeSubmissionParams, { problem: item.id }),
            )
            if (codeSubmissions.count) {
              item.submissionId = codeSubmissions.results[0].id
              const codeSubmissionDetail = await this.getSubmissionDetailApi[type](item.submissionId)
              const { code, language, status, output, user } = codeSubmissionDetail
              Object.assign(item, { answer: code, language, status, output, user })
            }
            item.score = (this.scores[type][item.id] && this.scores[type][item.id][item.submissionId]) || 0
          }
        }
        for (const item of problems[QA]) {
          item.description = item.description.replace(/\\n/g, '')
          item.status = '没有提交'
          const scoreJson = this.scores[QA][item.id]
          item.submissionId = Reflect.ownKeys(scoreJson)[0]
          item.score = scoreJson[item.submissionId]
          item.maxScore = res.problem_score_json[QA][item.id]
          item.answer = ''
          item.comment = ''
          if (item.submissionId !== '-1') {
            const { answer, comment } = await this.getSubmissionDetailApi[QA](item.submissionId)
            item.status = ''
            item.answer = answer || ''
            item.comment = comment || ''
          }
        }
        for (const item of problems[CHOICE]) {
          item.description = item.description.replace(/\\n/g, '')
          item.options = JSON.parse(item.choice)
          item.isMultiple = item.multiple
          item.maxScore = res.problem_score_json[CHOICE][item.id]
          item.answer = this.choiceSubmission[item.id] || []
          item.score = this.scores[CHOICE][item.id] || 0
        }
        for (const item of problems[FILLIN]) {
          item.description = item.description.replace(/\\n/g, '')
          item.maxScore = res.problem_score_json[FILLIN][item.id]
          item.answer = this.fillInSubmission[item.id] || []
          item.score = this.scores[FILLIN][item.id] || 0
        }
        this.problems = problems
      } catch (err) {
        this.$message.error('获取数据失败')
        console.error(err)
      }
    },
    switchProblem(type, index) {
      this.currentType = type
      this.currentIndex = index
    },
    plainState(type, index) {
      return this.currentType === type && this.currentIndex === index
    },
    submitReview() {
      const data = {}
      for (const type of this.types) {
        const scores = {}
        if (type === CODING || type === CODEFILL || type === QA) {
          this.problems[type].forEach(item => {
            scores[`${item.id}`] = {}
            scores[`${item.id}`][`${item.submissionId}`] = item.score
          })
        } else {
          this.problems[type].forEach(item => {
            scores[`${item.id}`] = {}
            scores[`${item.id}`] = item.score
          })
        }
        data[type2score[type]] = JSON.stringify(scores)
      }
      updateContestSubmission(this.id)(data)
        .then(res => {
          this.$message.success('提交成功')
        })
        .catch(err => {
          this.$message.error('提交失败')
          if (err instanceof FormError) {
            const { data } = err
            this.formError = data
          }
          console.error(err)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 50px);
  overflow: hidden;
  .aside {
    padding: 10px;
    width: 300px !important;
    background: #efefef;
    height: 100%;
    .score-input {
      height: 40px;
      width: 150px;
    }
    .submit {
      margin-top: 30px;
      width: 205px;
    }
    span {
      font-size: 0.8em;
    }
  }
}
</style>
