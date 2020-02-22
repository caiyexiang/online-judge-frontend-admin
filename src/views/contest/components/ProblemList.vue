<template>
  <div>
    <div class="header" v-if="route !== 'ProblemSelect'">
      <div>【总分: {{ totalScore.sum }}分】注意：总分数必须为100分。</div>
    </div>
    <div class="table" @dragend.capture="handleDragEnd">
      <div v-for="type in PROBLEM_ENUM" :key="type">
        <el-divider content-position="left">
          <span v-if="route !== 'ProblemSelect'">【{{ totalScore[type] }}分】</span> {{ PROBLEM_TYPE_CN[type] }} ({{
            problems[type].length
          }})
        </el-divider>
        <el-table :data="problems[type]" :show-header="false" :key="type" size="small" v-table-draggable="problems[type]">
          <el-table-column prop="id" width="50" />
          <el-table-column :prop="titleProp(type)" />
          <el-table-column v-if="route !== 'ProblemSelect'" align="right">
            <template slot-scope="{ row: { id } }">
              <el-input-number
                :value="problems_score[type][id]"
                @change="handleScoreChange(type, id, $event)"
                size="mini"
                :precision="2"
                :step="1"
                :min="0"
                :max="100"
                step-strictly
              />
              分
            </template>
          </el-table-column>
          <el-table-column align="center" width="40">
            <svg-icon class="drag-handler" icon-class="drag" />
          </el-table-column>
          <el-table-column align="right" width="75" v-if="route !== 'ProblemSelect'">
            <template slot-scope="{ row }">
              <el-button size="mini" type="primary" @click="handleDetail(type, row.id)">
                详情
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align="right" width="75">
            <template slot-scope="{ row }">
              <el-button size="mini" type="danger" @click="handleDelete(type, row.id)">
                移出
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import openWindow from '@/utils/open-window'
import { mapGetters, mapMutations } from 'vuex'
import { PROBLEM_ENUM, PROBLEM_TYPE_CN } from '@/utils/constant'
import ElTableDraggableDirectives from 'el-table-draggable-directives'
const { CODING, CHOICE, CODEFILL, FILLIN, QA } = PROBLEM_ENUM
export default {
  name: 'ProblemList',
  data() {
    return {
      PROBLEM_ENUM,
      PROBLEM_TYPE_CN
    }
  },
  directives: {
    'table-draggable':ElTableDraggableDirectives
  },
  computed: {
    /**
     * 目前缺少：随机加题 / 分数助手 / 表格拖拽
     */
    ...mapGetters(['problems', 'problems_score']),
    totalScore () {
      const total = {[CODING]: 0, [CHOICE]: 0, [CODEFILL]: 0, [FILLIN]: 0, [QA]: 0}
      let sum = 0
      for(const type of [CODING, CHOICE, CODEFILL, FILLIN, QA]) {
        for(const key in this.problems_score[type]) {
          const value = this.problems_score[type][key]
          total[type] += value
          sum += value
        }
      }
      total.sum = sum
      return total
    },
    route () {
      return this.$route.name
    }
  },
  methods: {
    titleProp(type) {
      if(type === CODING || type === CODEFILL) {
        return 'title'
      } else {
        return 'description'
      }
    },
    handleDetail(type, id) {
      const routeMap = {
        [CODING]: 'coding',
        [CHOICE]: 'choice',
        [CODEFILL]: 'code-fill',
        [FILLIN]: 'fill-in',
        [QA]: 'qa',
      }
      openWindow(`/problem/${routeMap[type]}/${id}`)
    },
    handleScoreChange(type, id, value) {
      this.$store.commit('problem/SET_PROBLEM_SCORE', {type, id, value})
    },
    handleDelete(type, id) {
      this.$store.commit('problem/DELETE_PROBLEM', {type, id})
      this.$store.commit('problem/DELETE_PROBLEM_SCORE', {type, id})
    },
    handleDragEnd() {
      this.$store.commit('problem/SET_PROBLEMS', this.problems)
    }
  },
}
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 10px;
  & .button-group {
    margin-bottom: 10px;
  }
}
.drag-handler {
  width: 18px;
  height: 18px;
  cursor: move;
}
</style>
