<template>
  <div class="app-container">
    <div class="filter-container">
      <Search
        v-model="filterQuery.search"
        class="filter-item"
        placeholder="输入知识点信息搜索"
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
    />
    <Pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="pageQuery.limit"
      :page.sync="page"
      @pagination="getTable"
    />
    <el-dialog title="创建知识点" :visible.sync="dialogVisible.add" @close="closeDialog('add')">
      <Detail ref="add" @fetch="getTable" @close="closeDialog('add')" />
    </el-dialog>
    <el-dialog title="修改知识点" :visible.sync="dialogVisible.edit" @close="closeDialog('edit')">
      <Detail ref="edit" :id="currentId" @fetch="getTable" @close="closeDialog('edit')" />
    </el-dialog>
  </div>
</template>

<script>
import { getTags, deleteTag } from '@/api/tag'
import Table from '@/components/Table'
import Search from '@/components/TableTools/Search'
import AddButton from '@/components/TableTools/AddButton'
import Pagination from '@/components/Pagination/index'
import Detail from './components/Detail'
export default {
  name: 'Tag',
  components: {
    Table,
    AddButton,
    Pagination,
    Detail,
    Search
  },
  data() {
    return {
      dialogVisible: {
        add: false,
        edit: false,
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
      currentId: 0,
      columns: { name: '名称', 'course.name': '对应课程' },
      buttons: [
        { type: 'danger', name: '删除', event: 'delete', permission: 0},
        { type: 'primary', name: '详情', event: 'edit' },
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
      getTags({ ...this.pageQuery, ...this.filterQuery }).then(res => {
        this.loading = false
        const { count, results } = res
        this.total = count
        this.table = results
      })
    },
    openDialog(name) {
      this.dialogVisible[name] = true
    },
    handleTableEvent(event, { id }) {
      if (event === 'delete') {
        this.$confirm('将删除该知识点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(_ =>
            deleteTag(id)
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
        this.currentId = id
        this.dialogVisible[event] = true
      }
    },
    closeDialog(name) {
      this.$refs[name].initFormError()
      this.$refs[name].resetForm()
      this.dialogVisible[name] = false
      this.currentId = 0
    },
  },
}
</script>
