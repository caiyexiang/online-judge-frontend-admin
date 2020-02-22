<template>
  <div>
    <Excel :table="excelTable" :columns="excelColumns" :filename="`测验${id}-学生成绩排行`" style="margin-bottom: 10px"/>
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
// 提供测验的成绩表格和导出功能
// 传入测验Id, 显示表格
import Excel from '@/components/Excel'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination/index'
import { getContestSubmissions } from '@/api/submission'
export default {
  name: 'SubmissionTable',
  components: {
    Excel,
    Table,
    Pagination,
  },
  props: {
    id: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      table: [],
      allData: [],
      total: 0,
      loading: false,
      columns: {
        username: '用户名',
        total_score: '总分',
        fill_in_score: '填空题分数',
        choice_score: '选择题分数',
        code_fill_score: '代码补全题分数',
        coding_score: '编程题分数',
        qa_score: '问答题分数',
      },
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
    /**
     * 先limit=1获取总数,一次性获取全部数据放入allData, 再取第一页给tableData, handlePageChange时再取第n页给tableData
     */
    async getTable() {
      this.loading = true
      const { count } = await getContestSubmissions({ detail: false, contest: this.id, limit: 1 })
      this.total = count
      const { results } = await getContestSubmissions({ detail: true, contest: this.id, limit: count })
      this.allData = results.map(
        ({
          user: { username },
          total_score,
          score_per_type: { fill_in_score, choice_score, code_fill_score, coding_score, qa_score },
        }) => {
          return { username, total_score, fill_in_score, choice_score, code_fill_score, coding_score, qa_score }
        },
      )
      this.handlePageChange(1)
      this.loading = false
    },
    handlePageChange(page) {
      this.table = this.allData.slice((page - 1) * 10, page * 10)
    },
  },
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 10px;
  text-align: center;
}
</style>
