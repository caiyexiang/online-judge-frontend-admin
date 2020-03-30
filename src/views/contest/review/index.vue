<template>
  <div class="app-container">
    <div class="filter-container">
      <Search v-model="filterQuery.search" class="filter-item" placeholder="输入用户名搜索" style="width:300px" />
      <el-button type="primary" @click="openDialog('contest')" class="filter-item">测验成绩排行及导出</el-button>
      <el-button type="primary" @click="openDialog('codeScores')" class="filter-item">编程题分数排行及导出</el-button>
      <el-button type="primary" @click="openDialog('codeSubmission')" class="filter-item">编程题提交列表及导出</el-button>
      <el-button @click="openDialog('coding')" class="filter-item">传统OJ编程排行榜</el-button>
    </div>
    <Table :loading="loading" :table="table" :columns="columns" :buttons="buttons" @table-event="handleTableEvent" />
    <Pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="pageQuery.limit"
      :page.sync="page"
      @pagination="getTable"
    />
    <el-dialog title="测验成绩排行" :visible.sync="dialogVisible.contest">
      <SubmissionTable :id="id" />
    </el-dialog>
    <el-dialog title="编程排行榜" :visible.sync="dialogVisible.coding">
      <Rank :id="id" />
    </el-dialog>
    <el-dialog title="编程题提交列表" :visible.sync="dialogVisible.codeSubmission">
      <CodeSubmission :id="id" @close="dialogVisible.codeSubmission = false" />
    </el-dialog>
    <el-dialog title="编程题分数排行" :visible.sync="dialogVisible.codeScores">
      <CodeScores :id="id" :total="total" @close="dialogVisible.codeScores = false" />
    </el-dialog>
  </div>
</template>

<script>
import { getContestSubmissions } from '@/api/submission'
import Table from '@/components/Table'
import Search from '@/components/TableTools/Search'
import Pagination from '@/components/Pagination/index'
import SubmissionTable from './components/SubmissionTable'
import CodeSubmission from './components/CodeSubmission'
import CodeScores from './components/CodeScores'
import Rank from '@/components/Rank'
export default {
  name: 'Log',
  components: {
    Table,
    Search,
    Pagination,
    SubmissionTable,
    Rank,
    CodeSubmission,
    CodeScores
  },
  data() {
    return {
      id: Number(this.$route.params.contest),
      pageQuery: {
        limit: 10,
        offset: 0,
      },
      filterQuery: {
        search: '',
      },
      table: [],
      total: 0,
      loading: false,
      columns: { id: '提交ID', 'user.username': '用户ID', total_score: '总分数' },
      buttons: [{ name: '批阅', type: 'success', event: 'review' }],
      dialogVisible: {
        contest: false,
        coding: false,
        codeSubmission: false,
        codeScores: false
      },
    }
  },
  watch: {
    filterQuery: {
      handler: function(val, oldVal) {
        this.page = 1
        this.getTable()
      },
      deep: true,
    },
  },
  created() {
    this.getTable()
  },
  computed: {
    page: {
      get() {
        return Math.floor(this.pageQuery.offset / this.pageQuery.limit) + 1
      },
      set(val) {
        this.pageQuery.offset = (val - 1) * this.pageQuery.limit
      },
    },
  },
  methods: {
    getTable() {
      this.loading = true
      getContestSubmissions({ ...this.pageQuery, ...this.filterQuery, contest: this.id }).then(({ count, results }) => {
        this.total = count
        this.table = results
        this.loading = false
      })
    },
    openDialog(name) {
      this.dialogVisible[name] = true
    },
    handleTableEvent(name, { id }) {
      this.$router.push({ name: 'EditReview', params: { contest: this.id, submission: id } })
    },
  },
}
</script>
