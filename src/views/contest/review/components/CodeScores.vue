<template>
  <div>
    <Excel
      :table="excelTable"
      :columns="excelColumns"
      :filename="`测验${id}-编程题成绩排行`"
      style="margin-bottom: 10px"
    />
    <Table :loading="loading" :table="table" :columns="columns" />
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
import Excel from '@/components/Excel'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination/index'
import { getContestSubmissions, getContestSubmission } from '@/api/submission'
import { reduce } from 'lodash'

function switchColumn(name) {
  switch (name) {
    case 'username':
      return '用户名'
    case 'sum':
      return '总分'
    default:
      return name
  }
}

export default {
  components: {
    Excel,
    Table,
    Pagination,
  },
  props: {
    id: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      table: [],
      columns: {},
      loading: false,
      allData: [],
    }
  },
  computed: {
    excelTable() {
      return this.allData.map(item => Object.values(item))
    },
    excelColumns() {
      return Object.values(this.columns)
    },
  },
  created() {
    this.getTable()
  },
  methods: {
    handlePageChange(page) {
      this.table = this.allData.slice((page - 1) * 10, page * 10)
    },
    async getTable() {
      /**
       * 获取全部的rank，根据用户名获取
       */
      try {
        this.loading = true
        // 获取批阅列表
        const contestSubmissions = await getContestSubmissions({ contest: this.id, limit: this.total })
        // 拿一下user:username映射表
        const userMap = contestSubmissions.results.reduce((prev, curr) => {
          const id = curr.user.id
          const username = curr.user.username
          return Object.assign(prev, { [id]: username })
        }, {})

        const { results } = await getContestSubmissions({ contest: this.id, limit: this.total, coding: true })
        // 根据批阅列表获取批阅详情,并且按照分数排序
        console.log(results)
        const scores = results.map(({ user, coding_score }) => {
            const codingScoreJson = JSON.parse(coding_score)
            const codingScoreObj = {}
            for (const key in codingScoreJson) {
              codingScoreObj[`问题${key}`] = Object.values(codingScoreJson[key])[0]
            }
            const sum = reduce(codingScoreObj, (r, v) => r + v, 0)
            const username = userMap[user]
            return { username, sum, ...codingScoreObj }
          })
          .sort((a, b) => {
            return b.sum - a.sum
          })

        if (scores.length > 0) {
          this.columns = Object.keys(scores[0]).reduce((prev, curr) => {
            return Object.assign(prev, { [curr]: switchColumn(curr) })
          }, {})
          this.allData = scores
          this.handlePageChange(1)
        }
      } catch (e) {
        this.$message.error('导出失败')
        console.table(e)
      }
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.pagination {
  text-align: center;
  margin-top: 10px;
}
</style>
