<template>
  <div class="app-container">
    <Table :loading="loading" :table="table" :buttons="buttons" :columns="columns" @table-event="handleTableEvent"/>
    <Pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="pageQuery.limit"
      :page.sync="page"
      @pagination="getTable"
    />
    <el-dialog title="导入用户" :visible.sync="dialogVisible">
      <TaskLogDetail :id="currentId"/>
    </el-dialog>
  </div>
</template>

<script>
import { getCodeCheckLogs } from '@/api/code-check'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import TaskLogDetail from './components/TaskLogDetail'
export default {
  components: {
    Table,
    Pagination,
    TaskLogDetail
  },
  data () {
    return {
      id: this.$route.params.id,
      pageQuery: {
        limit: 10,
        offset: 0,
      },
      loading: false,
      dialogVisible: false,
      table: [],
      columns: {
        problem_id: '问题ID',
        'submission_a.user.username': '用户A',
        'submission_b.user.username': '用户B',
        'submission_a.language': '用户A语言',
        'submission_b.language': '用户B语言',
        cfg_similarity: '文本相似度',
        dfg_similarity: '结构相似度',
        has_view: '处理状况'
      },
      buttons: [{type:'primary',event: 'detail', name: '查看'}],
      total: 0,
      currentId: undefined
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
  created () {
    this.getTable()
  },
  methods: {
    getTable() {
      this.loading = true
      getCodeCheckLogs({...this.pageQuery, task: this.id}).then(({count,results}) => {
        this.loading = false
        this.total = count
        results.forEach(item => {
          item.has_view = item.has_view ? '已查看' : '未查看'
        })
        this.table = results
      })
    },
    handleTableEvent(event, {id}) {
      if(event === 'detail') {
        this.currentId = id
        this.dialogVisible = true
      }
    }
  }
}
</script>
