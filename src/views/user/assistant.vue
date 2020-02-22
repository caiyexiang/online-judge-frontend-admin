<template>
  <div class="app-container">
    <div class="filter-container">
      <Search
        v-model="filterQuery.search"
        class="filter-item"
        placeholder="输入学号搜索"
        style="width:200px;margin-right:20px;"
      />
      <span class="filter-item"> 增加、修改助教需到班级管理中操作 </span>
    </div>
    <Table :loading="loading" :table="table" :columns="columns" :buttons="buttons" @table-event="handleTableEvent" />
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
import { getAssistants, deleteAssistant } from '@/api/user'
import Table from '@/components/Table'
import Search from '@/components/TableTools/Search'
import Pagination from '@/components/Pagination/index'
export default {
  name: 'Assistant',
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
      },
      table: [],
      total: 0,
      loading: false,
      columns: {
        id: '助教ID',
        username: '学号',
        name: '姓名',
        courseId: '课程编号',
        courseName: '课程名称',
        teacher: '授课老师',
      },
      buttons: [{ name: '撤回助教权限', type: 'danger', event: 'delete' }],
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
      getAssistants({ ...this.pageQuery, ...this.filterQuery }).then(res => {
        this.loading = false
        const { count, results } = res
        this.total = count
        const table = []
        for(const assistant of results) {
          const {id, name, username} = assistant
          for(const course of assistant.assistant_group_set) {
            const teacher = course.teacher.reduce((total,t)=>{return total+=` ${t.username}`},'')
            const courseId = course.id
            const courseName = course.name
            table.push({id,name,username,courseId,courseName,teacher})
          }
        }
        this.table = table
      })
    },
    handleTableEvent(event, { id, courseId }) {
      if (event === 'delete') {
        this.$confirm('此撤回操作无法撤回, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deleteAssistant(id, courseId).then(() => {
              this.$message.success('撤回权限成功')
              this.getTable()
            })
          })
          .catch(_ => {})
      }
    },
  },
}
</script>
