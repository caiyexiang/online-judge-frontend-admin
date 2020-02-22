<template>
  <div class="app-container">
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
import { getJudgers } from '@/api/judger'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination/index'
export default {
  name: 'Juger',
  components: {
    Table,
    Pagination,
  },
  data() {
    return {
      pageQuery: {
        limit: 10,
        offset: 0,
      },
      table: [],
      total: 0,
      loading: false,
      columns: { ip: 'IP地址', is_alive: '状态', running_container: '正在运行容器数', max_container: '最大容纳数' }
    }
  },
  activated () {
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
      getJudgers(this.pageQuery).then(({ count, results }) => {
        this.loading = false
        this.total = count
        this.table = results
      })
    },
  },
}
</script>
