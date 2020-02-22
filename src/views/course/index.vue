<template>
  <div class="app-container">
    <div class="filter-container">
      <AddButton class="filter-item" @click.native="handleAdd" />
    </div>
    <Table :loading="loading" :table="table" :columns="columns" :buttons="buttons" @table-event="handleTableEvent" />
    <Pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="pageQuery.limit"
      :page.sync="page"
      @pagination="getTable"
    />
    <el-dialog title="创建课程" :visible.sync="addDialogVisible" @close="handleClose">
      <Detail ref="add" @fetch="getTable" @close="handleClose" />
    </el-dialog>
  </div>
</template>

<script>
import { getCourses, deleteCourse } from '@/api/course'
import Table from '@/components/Table'
import AddButton from '@/components/TableTools/AddButton'
import Pagination from '@/components/Pagination/index'
import Detail from './components/Detail'
export default {
  name: 'Course',
  components: {
    Table,
    AddButton,
    Pagination,
    Detail
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
      columns: { id: '课程编号', name: '课程名称' },
      buttons: [{type:'danger', name: '删除', event: 'delete'}],
      addDialogVisible: false,
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
      getCourses(this.pageQuery).then(res => {
        this.loading = false
        const { count, results } = res
        this.total = count
        this.table = results
      })
    },
    handleAdd() {
      this.addDialogVisible = true
    },
    handleTableEvent(event, { id }) {
      if (event === 'delete') {
        this.$confirm('将删除该课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deleteCourse(id)
              .then(() => {
                this.$message.success('删除成功!')
                this.page = 1
                this.getTable()
              })
              .catch(error => {
                this.$message.error(error)
              })
          })
          .catch(error => {})
      }
    },
    handleClose() {
      this.$refs['add'].initFormError()
      this.$refs['add'].resetForm()
      this.addDialogVisible = false
    },
  }
}
</script>
