
<template>
  <div class="app-container">
    <div class="filter-container">
      <AddButton class="filter-item" @click.native="openDialog('add')" />
    </div>
    <el-table v-loading="loading" :data="table" style="width: 100%;" border fit highlight-current-row>
      <el-table-column label="ID" prop="id" width="80" sortable="custom" align="center" />
      <el-table-column label="任务名称" prop="name" align="center"/>
      <el-table-column label="问题" prop="problems" align="center">
      </el-table-column>
      <el-table-column label="状态" width="80" prop="status">
        <template slot-scope="{ row }">
          <el-tag :type="statusMap[row.status].type">
            {{ statusMap[row.status].name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding">
        <template slot-scope="{ row }">
          <el-button v-if="row.status === 2" size="mini" type="success" @click="handleTableEvent('result',row)">
            查重结果
          </el-button>
          <el-button size="mini" type="primary" @click="handleTableEvent('detail',row)">
            详情
          </el-button>
          <el-button size="mini" type="danger" @click="handleTableEvent('delete' ,row)">
            删除
          </el-button>
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
    <el-dialog title="新建查重任务" :visible.sync="dialogVisible['add']" @close="closeDialog('add')">
      <Add ref="add" @fetch="getTable" @close="closeDialog('add')" />
    </el-dialog>
    <el-dialog title="查重任务详情" :visible.sync="dialogVisible['detail']">
      <Detail ref="detail" :id="currentId" @fetch="getTable" />
    </el-dialog>
  </div>
</template>

<script>
import { getCodeCheckTasks, deleteCodeCheckTask } from '@/api/code-check'
import AddButton from '@/components/TableTools/AddButton'
import Pagination from '@/components/Pagination/index'
import Detail from './components/Detail'
import Add from './components/Add'
export default {
  name: 'CodeCheck',
  components: {
    AddButton, Pagination, Detail, Add
  },
  data () {
    return {
      dialogVisible: {
        add: false,
        detail: false
      },
      pageQuery: {
        limit: 10,
        offset: 0,
      },
      table: [],
      total: 0,
      loading: false,
      currentId: 0,
      statusMap: {
        0: {name: '等待中', type: 'info'},
        1: {name: '进行中', type: ''},
        2: {name: '已完成', type: 'success'}
      }
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
      getCodeCheckTasks(this.pageQuery).then(({count, results}) => {
        this.loading = false
        this.total = count
        this.table = results
      })
    },
    openDialog(name) {
      this.dialogVisible[name] = true
    },
    handleTableEvent(event, { id }) {
      if (event === 'delete') {
        this.$confirm('将删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(_ =>
            deleteCodeCheckTask(id)
              .then(_ => {
                this.$message.success('删除成功!')
                this.page = 1
                this.getTable()
              })
              .catch(error => {
                this.$message.error('删除失败')
                console.error(error)
              }),
          )
          .catch(error => {})
      } else if(event === 'detail') {
        this.currentId = id
        this.dialogVisible[event] = true
      } else if(event === 'result') {
        this.$router.push({name:'TaskLog', params:{id}})
      }
    },
    closeDialog(name) {
      this.$refs[name].initFormError()
      this.$refs[name].resetForm()
      this.dialogVisible[name] = false
      this.currentGroupId = 0
    },
  }
}
</script>
