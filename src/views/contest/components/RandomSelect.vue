<template>
  <div>
    <el-card>
      <p><strong>注意：随机出题后会覆盖原题目列表数据</strong></p>
      <div class="card-main">
        <h3>选择每种类型题目数量，随机出题</h3>
        <div
          v-for="type of TYPE_LIST"
          :key="type"
          class="type-container"
        >
          <p> {{ PROBLEM_TYPE_CN[type] }} : </p>
          <el-input-number
            v-model="problemsNumber[type]"
            :step="1"
            :max="100"
            :min="0"
            step-strictly
          />
          <InputSelector
            v-model="problemTag[type]"
            clearable
          />
        </div>
      </div>
      <el-button
        type="success"
        @click="handleRandomSelect"
      >
        随机出题
      </el-button>
    </el-card>
  </div>
</template>

<script>
import InputSelector from '@/components/InputSelector'
import { getProblems, getChoices, getFillIns, getQAs, getCodeFills, getFillIn } from '@/api/problem'
import { PROBLEM_ENUM, PROBLEM_TYPE_CN }  from '@/utils/constant'
const { CODING, CHOICE, FILLIN, QA, CODEFILL } = PROBLEM_ENUM
const TYPE_LIST = Object.keys(PROBLEM_TYPE_CN)
export default {
  name: 'RandomSelect',
  components: {
    InputSelector
  },
  data () {
    return {
      problems: { [CODING]: [], [CHOICE]: [], [FILLIN]: [], [QA]: [], [CODEFILL]: [] },
      problemsNumber: { [CODING]: 0, [CHOICE]: 0, [FILLIN]: 0, [QA]: 0, [CODEFILL]: 0 },
      problemTag: { [CODING]: '', [CHOICE]: '', [FILLIN]: '', [QA]: '', [CODEFILL]: '' },
      fetchApi: {
        [CODING]: getProblems,
        [CHOICE]: getChoices,
        [FILLIN]: getFillIns,
        [QA]: getQAs,
        [CODEFILL]: getCodeFills
      },
      TYPE_LIST,
      PROBLEM_TYPE_CN
    }
  },
  methods: {
    async handleRandomSelect () {
      // 边界条件 - limit=0时不进行ajax,并且返回结果为空列表
      // 构造好每一个params
      // 封装好每一个api/promise
      // Promise.all
      // 处理数据为problems的格式
      const ajaxList = TYPE_LIST.map(type => this.genAjax(type))
      const resList = await Promise.all(ajaxList)
      const score = { [CODING]: {}, [CHOICE]: {}, [FILLIN]: {}, [QA]: {}, [CODEFILL]: {} }
      for (const type of TYPE_LIST) {
        this.problems[type] = this.problemsNumber[type] === 0 ? [] : resList[type].results
        this.problems[type].forEach(item => {
          score[type][item.id] = 0
        })
      }
      this.$store.commit('problem/SET_PROBLEMS', this.problems)
      this.$store.commit('problem/SET_PROBLEMS_SCORE', score)
      this.$message.success('随机出题成功')
      this.$emit('close')
    },
    genAjax (type) {
      const params = {
        ordering: '%3F',
        limit: this.problemsNumber[type]
      }
      if (this.problemTag[type]) {
        params.tag = this.problemTag[type]
      }
      return this.problemsNumber[type] === 0 ? 0 : this.fetchApi[type](params)
    }
  }
}
</script>

<style lang="scss" scoped>
.type-container {
  margin-bottom: 10px;
}
.card-main {
  margin-bottom: 20px;
}
</style>
