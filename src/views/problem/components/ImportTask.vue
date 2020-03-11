<template>
  <div>
    <el-table :data="table" style="width: 100%;" border fit highlight-current-row size="mini">
      <el-table-column label="ID" prop="id" width="50" align="center" />
      <el-table-column label="提交用户" prop="user.username" width="80" align="center" />
      <el-table-column label="文件名" prop="name" align="center" />
      <el-table-column label="服务器信息" prop="msg" width="120" align="center">
        <template slot-scope="{ row }">
          <div class="text-overflow" :title="row.msg">
            {{ row.msg }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="进度" prop="progress" width="50" align="center" />
      <el-table-column label="状态" width="80" prop="status">
        <template slot-scope="{ row }">
          <el-tag :type="statusMap[row.status].type">
            {{ statusMap[row.status].name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80" class-name="small-padding">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="handleDetail(row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageQuery.limit"
      :current-page.sync="page"
    />
    <el-dialog title="导入详情" :visible.sync="dialogVisible" append-to-body>
      <ImportTaskDetail :task="currentTask" />
    </el-dialog>
  </div>
</template>

<script>
import { getImportTasks } from '@/api/problem'
import Table from '@/components/Table'
import ImportTaskDetail from './ImportTaskDetail'
export default {
  name: 'ImportTask',
  components: {
    Table,
    ImportTaskDetail
  },
  data() {
    return {
      table: [],
      columns: [],
      buttons: [],
      total: 0,
      interval: 5000, // 5s刷新列表
      dialogVisible: false,
      pageQuery: {
        offset: 0,
        limit: 6,
      },
      currentTask: {},
      statusMap: {
        '-1': { name: '错误', type: 'danger' },
        '0': { name: '等待中', type: 'info' },
        '1': { name: '进行中', type: '' },
        '2': { name: '已完成', type: 'success' },
      },
    }
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
  created() {
    const timer = setInterval(() => {
      this.getTable()
    }, this.interval)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
    })
  },
  watch: {
    'pageQuery.offset': {
      handler() {
        this.getTable()
      },
      immediate: true,
    },
  },
  methods: {
    getTable() {
      getImportTasks(this.pageQuery).then(({ count, results }) => {
        this.table = results
        this.total = count
      })
    },
    handleDetail(row) {
      this.currentTask = row
      this.dialogVisible = true
    },
  },
}
</script>

<style scoped>
.pagination {
  text-align: center;
  margin-top: 10px;
}
.text-overflow {
  white-space:nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}
</style>
