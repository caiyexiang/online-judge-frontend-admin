<template>
  <div class="app-container">
    <div class="filter-container">
      <Search v-model="filterQuery.search" class="filter-item" style="width:200px;" placeholder="输入用户名搜索" />
      <el-select
        v-model="filterQuery.action"
        class="filter-item"
        style="width:150px;"
        placeholder="操作字段搜索"
        clearable
        filterable
      >
        <el-option label="登录" value="登录" />
        <el-option label="恶意登录尝试" value="恶意登录尝试" />
        <el-option label="不一致登录" value="不一致登录" />
      </el-select>
      <el-select class="filter-item" style="width:120px;" clearable v-model="filterQuery.type" placeholder="全部类型">
        <el-option label="普通类型" value="normal" />
        <el-option label="危险类型" value="danger" />
      </el-select>
      <el-date-picker
        class="filter-item"
        v-model="filterQuery.start_time"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择开始时间"
      />
      <el-date-picker
        class="filter-item"
        v-model="filterQuery.end_time"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择结束时间"
      />
    </div>
    <el-table v-loading="loading" :data="table" style="width: 100%;" border fit highlight-current-row>
      <el-table-column label="时间" prop="time" />
      <el-table-column label="IP" prop="ip" />
      <el-table-column label="用户名" prop="user.username" />
      <el-table-column label="操作" prop="action" />
      <el-table-column label="操作描述" prop="desc">
        <template slot-scope="{ row }">
          <div :title="row.desc" class="text-overflow"> {{ row.desc }} </div>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="pageQuery.limit"
      :page.sync="page"
      @pagination="getTable"
    />
  </div>
</template>

<script>
import { getLogs } from '@/api/log'
import { parseTime } from '@/utils'
import Table from '@/components/Table'
import Search from '@/components/TableTools/Search'
import Pagination from '@/components/Pagination/index'
export default {
  name: 'Log',
  components: {
    Table,
    Search,
    Pagination,
  },
  data() {
    return {
      pageQuery: {
        limit: 10,
        offset: 0,
      },
      filterQuery: {
        search: '',
        type: '',
        start_time: '',
        end_time: '',
      },
      table: [],
      total: 0,
      loading: false,
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
      getLogs({ ...this.pageQuery, ...this.filterQuery }).then(res => {
        this.loading = false
        const { count, results } = res
        this.total = count
        results.forEach(item => {
          item.username = item.user ? item.user.username : ''
          item.time = parseTime(item.time)
        })
        this.table = results
      })
    },
  },
}
</script>
