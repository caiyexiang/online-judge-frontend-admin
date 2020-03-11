<template>
  <div class="app-container">
    <div class="filter-container">
      <Search v-model="filterQuery.search" class="filter-item" placeholder="输入用户名搜索" />
    </div>
    <Table :loading="loading" :table="table" :columns="columns" />
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
        search: ''
      },
      table: [],
      total: 0,
      loading: false,
      columns: { last_login_time: '时间', last_login_ip: 'IP地址', action: '操作' },
    }
  },
  watch: {
    filterQuery: {
      handler: function(val, oldVal) {
        this.page = 1
        this.getTable()
      },
      deep: true,
    }
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
      getLogs({...this.pageQuery,...this.filterQuery}).then(res => {
        this.loading = false
        const { count, results } = res
        this.total = count
        results.forEach(item => {
          item.last_login_time = parseTime(item.last_login_time)
        })
        this.table = results
      })
    },
  },
}
</script>
