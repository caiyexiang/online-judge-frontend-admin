<template>
  <div class="app-container" :key="routeName">
    <div class="filter-container">
      <Search v-model="filterQuery.search" class="filter-item" placeholder="输入用户名搜索" style="width:200px;margin-right:20px;" v-if="$route.name !== 'Admin'"/>
      <AddButton class="filter-item" @click.native="handleAdd" v-if="$route.name !== 'Admin'" />
      <ImportButton class="filter-item" @click.native="handleImport" v-if="$route.name === 'Student'" />
    </div>
    <Table :loading="loading" :table="table" :columns="columns" :buttons="buttons" @table-event="handleTableEvent" />
    <Pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="pageQuery.limit"
      :page.sync="page"
      @pagination="getTable"
    />
    <el-dialog title="创建用户" :visible.sync="addDialogVisible" @close="handleClose('add')">
      <Detail ref="add" @fetch="getTable" @close="handleClose('add')" />
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" @close="handleClose('edit')">
      <Detail ref="edit" @fetch="getTable" :id="currentUserid" @close="handleClose('edit')" />
    </el-dialog>
    <el-dialog title="导入用户" :visible.sync="importDialogVisible" @close="handleClose('import')">
      <Import ref="import" @fetch="getTable" @close="handleClose('import')" />
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, createUser, deleteUser } from '@/api/user'
import Table from '@/components/Table'
import Search from '@/components/TableTools/Search'
import AddButton from '@/components/TableTools/AddButton'
import ImportButton from '@/components/TableTools/ImportButton'
import Pagination from '@/components/Pagination/index'
import Detail from './components/Detail'
import Import from './components/Import'
export default {
  name: 'User',
  components: {
    Table,
    Search,
    Pagination,
    AddButton,
    ImportButton,
    Detail,
    Import,
  },
  data() {
    return {
      importDialogVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      pageQuery: {
        limit: 10,
        offset: 0,
      },
      filterQuery: {
        search: '',
        permission: 3,
      },
      table: [],
      total: 0,
      loading: false,
      columns: { username: '账户ID/学号', name: '姓名', nickname: '昵称' },
      buttons: [],
      currentUserid: 0,
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
  activated() {
    this.getTable()
    if (this.$route.name !== 'Admin') {
      this.buttons = [
        { type: 'primary', event: 'edit', name: '编辑' },
        { type: 'danger', event: 'delete', name: '删除' },
      ]
    }
    switch (this.$route.name) {
      case 'Admin':
        this.filterQuery.permission = 0
        break
      case 'Teacher':
        this.filterQuery.permission = 1
        break
      case 'Student':
        this.filterQuery.permission = 3
        this.filterQuery.permission__gte = 2
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
    routeName () {
      return this.$route.name
    }
  },
  methods: {
    getTable() {
      this.loading = true
      getUsers({ ...this.pageQuery, ...this.filterQuery }).then(({ count, results }) => {
        this.loading = false
        this.total = count
        this.table = results
      })
    },
    handleAdd() {
      this.addDialogVisible = true
    },
    handleImport() {
      this.importDialogVisible = true
    },
    handleTableEvent(event, {id}) {
      switch (event) {
        case 'edit':
          this.currentUserid = id
          this.editDialogVisible = true
          break
        case 'delete':
          this.$confirm('将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            deleteUser(id)
              .then(() => {
                this.$message.success('删除成功!')
                this.page = 1
                this.getTable()
              })
              .catch(error => {
                this.$message.error(error)
              })
          }).catch(error=>{})
      }
    },
    handleClose(name) {
      this.$refs[name].initFormError()
      this.$refs[name].resetForm()
      switch (name) {
        case 'edit':
          this.editDialogVisible = false
          break
        case 'add':
          this.addDialogVisible = false
          break
        case 'import':
          this.importDialogVisible = false
      }
      this.currentUserid = 0
    },
  },
}
</script>
