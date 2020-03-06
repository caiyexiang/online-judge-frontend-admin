<template>
  <div>
    <el-card>
      <h3>快捷设置 → 自动平均分配每小题分数</h3>
      <el-button type="success" @click="setScore">
        快捷设置
      </el-button>
    </el-card>
    <el-card>
      <h3>手动设置每类题型的分数，再自动平均分配每小题分数</h3>
      <div v-for="type of notEmptyType" :key="type" class="type-container">
        {{ TYPE_NAME_LIST[type] }} :
        <el-input-number v-model="scoreArr[type]" :step="1" :max="100" :min="0" step-strictly />
      </div>
      <el-button type="primary" @click="setScoreByType">
        设置
      </el-button>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PROBLEM_NAME2TYPE } from '@/utils/constant'
import { getDefaultProblem, getDefaultScore } from '@/utils'
const TYPE_NAME_LIST = Object.keys(PROBLEM_NAME2TYPE)
const TYPE_LIST = Object.values(PROBLEM_NAME2TYPE)
export default {
  name: 'ScoreHelper',
  data() {
    return {
      scoreArr: Array(TYPE_NAME_LIST.length).fill(0),
      TYPE_NAME_LIST,
    }
  },
  computed: {
    ...mapGetters(['problems_length', 'problems', 'problems_score']),
    notEmptyType() {
      return TYPE_LIST.filter(type => {
        return this.problems[type].length
      })
    },
  },
  methods: {
    /**
     * 检测1. 是否有题目分配分数为空
     * 检测2. 题目分数和是否为100
     * 检测3. 题型分数/题目!=0
     */
    setScore() {
      const total = this.problems_length
      // 算出平均数 算出余数 最后一道题加余数
      const avg = Math.floor(100 / total)
      const score = getDefaultScore()
      if (avg === 0) {
        this.$message.error('题目太多了, 100分都不够分了！')
        return
      }
      const rest = 100 % total
      let flag = true
      let type, id
      for (type in this.notEmptyType) {
        for (id in this.problems_score[type]) {
          score[type][id] = avg
        }
      }
      score[type][id] = avg + rest
      this.$store.commit('problem/SET_PROBLEMS_SCORE', score)
      this.$message.success('分数设置成功')
      this.$emit('close')
    },
    setScoreByType() {
      const total = this.scoreArr.reduce((prev, curr) => prev + curr, 0)
      this.notEmptyType.forEach(type => {
        if (this.scoreArr[type] === 0) {
          this.$message.error('题型分数上限不能为0！')
          return
        }
      })
      if (total !== 100) {
        this.$message.error('题型分数之和必须等于100！')
        return
      }
      const score = getDefaultScore()
      for (const type of this.notEmptyType) {
        const total = this.problems[type].length
        const avg = Math.floor(this.scoreArr[type] / total)
        if (avg === 0) {
          this.$message.error('题型分数设得太少啦，题目不够分了！')
          return
        }
        const rest = this.scoreArr[type] % total
        let id
        for (id in this.problems_score[type]) {
          score[type][id] = avg
        }
        score[type][id] = avg + rest
      }
      this.$store.commit('problem/SET_PROBLEMS_SCORE', score)
      this.$message.success('分数设置成功')
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.type-container {
  margin: 20px 0;
}
</style>
