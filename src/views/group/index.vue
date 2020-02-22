<template>
  <div class="app-container">
    <div class="filter-container">
      <Search
        v-model="filterQuery.search"
        class="filter-item"
        placeholder="输入班级名称搜索"
        style="width:200px;margin-right:20px;"
      />
      <AddButton class="filter-item" @click.native="openDialog('add')" />
    </div>
    <Table
      :loading="loading"
      :table="table"
      :columns="columns"
      :buttons="buttons"
      @table-event="handleTableEvent"
      :actionsWidth="300"
    />
    <Pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="pageQuery.limit"
      :page.sync="page"
      @pagination="getTable"
    />
    <el-dialog title="创建班级" :visible.sync="dialogVisible.add" @close="closeDialog('add')">
      <Detail ref="add" @fetch="getTable" @close="closeDialog('add')" />
    </el-dialog>
    <el-dialog title="修改班级" :visible.sync="dialogVisible.edit" @close="closeDialog('edit')">
      <Detail ref="edit" :id="currentGroupId" @fetch="getTable" @close="closeDialog('edit')" />
    </el-dialog>
    <el-dialog title="重置学生密码" :visible.sync="dialogVisible.reset" @close="closeDialog('reset')">
      <ResetPassowrd ref="reset" :id="currentGroupId" @close="closeDialog('reset')" />
    </el-dialog>
  </div>
</template>

<script>
import { getGroups, deleteGroup } from '@/api/group'
import Table from '@/components/Table'
import Search from '@/components/TableTools/Search'
import AddButton from '@/components/TableTools/AddButton'
import Pagination from '@/components/Pagination/index'
import Detail from './components/Detail'
import ResetPassowrd from './components/ResetPassword'
export default {
  name: 'Group',
  components: {
    Table,
    AddButton,
    Pagination,
    Detail,
    Search,
    ResetPassowrd
  },
  data() {
    return {
      dialogVisible: {
        add: false,
        edit: false,
        reset: false,
      },
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
      currentGroupId: 0,
      columns: { name: '班级名称', courseName: '课程', teacher: '老师', users_count: '学生数量' },
      buttons: [
        { type: 'danger', name: '删除', event: 'delete' },
        { type: 'primary', name: '详情', event: 'edit' },
        { type: 'primary', name: '重置学生密码', event: 'reset' },
      ],
    }
  },
  watch: {
    filterQuery: {
      handler: function(val, oldVal) {
        this.page = 1
        this.getTable()
      },
      deep: true,
      immediate: true,
    },
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
      getGroups({ ...this.pageQuery, ...this.filterQuery }).then(res => {
        this.loading = false
        const { count, results } = res
        this.total = count
        this.table = results.map(({ id, name, course, teacher, users_count }) => {
          const courseName = course.name
          teacher = teacher.reduce((total, t) => {
            return (total += `${t.username} `)
          }, '')
          return { id, name, courseName, teacher, users_count }
        })
      })
    },
    openDialog(name) {
      this.dialogVisible[name] = true
    },
    handleTableEvent(event, { id }) {
      if (event === 'delete') {
        this.$confirm('将删除该班级, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(_ =>
            deleteGroup(id)
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
      } else {
        this.currentGroupId = id
        this.dialogVisible[event] = true
      }
    },
    closeDialog(name) {
      this.$refs[name].initFormError()
      this.$refs[name].resetForm()
      this.dialogVisible[name] = false
      this.currentGroupId = 0
    },
  },
}
</script>
