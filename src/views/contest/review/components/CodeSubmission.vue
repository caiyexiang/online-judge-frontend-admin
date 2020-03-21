<template>
  <div>
    <div class="sticky-header filter-container">
      <el-select class="filter-item" v-model="type" @change="getSubmissions" style="width:400px;">
        <el-option value="编程题">编程题</el-option>
        <el-option value="代码补全题">代码补全题</el-option>
      </el-select>
      <el-select class="filter-item" v-model="filterQuery.status" style="width:400px;">
        <el-option value="" label="全部提交" />
        <el-option value="Accepted" label="仅限通过的提交" />
      </el-select>
      <el-input class="filter-item" v-model="filterQuery.problem" placeholder="问题ID"/>
      <el-input class="filter-item" v-model="filterQuery.search" placeholder="用户名" />
      <el-button
        class="refresh-button filter-item"
        icon="el-icon-refresh-right"
        :disabled="disabled"
        circle
        @click="getSubmissions"
      />
    </div>
    <div class="container">
      <el-table :data="list" highlight-current-row stripe v-loading="loading">
        <el-table-column prop="time" label="时间">
          <template slot-scope="{ row: { time } }">
            {{ time | parseTime }}
          </template>
        </el-table-column>
        <el-table-column prop="problem" label="问题" />
        <el-table-column prop="user.username" label="用户">
          <template slot-scope="{ row }">
            <span @click="handleGoReview(row)" class="pointer">{{ row.user.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="语言" prop="language" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="{ row: { status } }">
            <span :style="status | statusClassFilter">{{ status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="耗时" prop="time_usage" />
        <el-table-column label="内存" prop="memory_usage" />
        <el-table-column>
          <template slot-scope="{ row: { id } }">
            <el-button type="primary" @click="handleDetail(id)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="total > 0"
        class="pagination"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="limit"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import openWindow from '@/utils/open-window'
import { getContestSubmissions } from '@/api/submission'
import { getSubmissions, getCodeFillSubmissions } from '@/api/submission'
export default {
  name: 'SubmissionTable',
  props:{
    query:{
      type: Object,
      default: null
    }
  },
  filters: {
    parseTime,
    statusClassFilter(status) {
      return status === 'Accepted' ? 'color:green' : 'color:red'
    },
  },
  data() {
    return {
      contest: this.$route.params.contest,
      type: '编程题',
      disabled: false,
      list: [],
      offset: 0,
      limit: 10,
      total: 0,
      loading: false,
      filterQuery: {
        problem: '',
        search: '',
        status: 'Accepted',
      },
      fetchApi: {
        编程题: getSubmissions,
        代码补全题: getCodeFillSubmissions,
      },
      detailName: {
        编程题: 'code-submission',
        代码补全题: 'code-fill-submission',
      },
    }
  },
  watch:{
    filterQuery: {
      handler() {
        this.getSubmissions()
      },
      deep: true
    },
    query:{
      handler() {
        this.filterQuery = {...this.filterQuery, ...this.query}
      },
      immediate: true
    }
  },
  computed: {
    page: {
      set(page) {
        this.offset = (page - 1) * this.limit
      },
      get() {
        return Math.floor(this.offset / this.limit) + 1
      },
    },
  },
  methods: {
    getSubmissions() {
      this.startTimer()
      const params = {
        offset: this.offset,
        limit: this.limit,
        contest: this.contest,
        ...this.filterQuery
      }
      this.loading = true
      this.fetchApi[this.type](params).then(({ count, results }) => {
        this.total = count
        this.list = results
        this.loading = false
      })
    },
    handleDetail(id) {
      openWindow(`/${this.detailName[this.type]}/${id}/`)
    },
    handlePageChange(page) {
      this.page = page
      this.getSubmissions()
    },
    startTimer() {
      this.disabled = true
      this.timer = window.setTimeout(() => {
        this.disabled = false
      }, 750)
    },
    handleGoReview({user: {username}}) {
      getContestSubmissions({contest: this.id, limit: 1, offset: 0, search: username}).then(({count, results:[{id}]}) => {
        this.$emit('close')
        if(count === 0) {
          return Promise.reject()
        }
        this.$router.push({name: 'EditReview', params: {contest: this.contest, submission: id}})
      }).catch(err =>{
        this.$message.error('获取该用户批阅数据失败')
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.sticky-header {
  position: sticky;
  top: 0px;
  z-index: 20;
  padding-bottom: 10px;
  box-shadow: 0 15px 10px -15px gray;
  justify-content: space-between;
  display: flex;
  background: white;
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 10px;
  text-align: center;
}
</style>
