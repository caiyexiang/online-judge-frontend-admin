<template>
  <div class="app-container">
    <div class="filter-container">
      <InputSelector
        style="width:130px;"
        class="filter-item"
        v-model="filterQuery.course"
        :fetch-api="getCourses"
        clearable
        placeholder="全部课程"
      />
      <AddButton class="filter-item" @click.native="handleAdd"/>
    </div>
    <el-table v-loading="loading" :data="table" style="width: 100%;" border fit highlight-current-row>
      <el-table-column label="编号" prop="id" width="80" align="center" />
      <el-table-column label="名称" prop="title" align="center" />
      <el-table-column label="课程" prop="course.name" align="center" />
      <el-table-column label="操作" align="center" width="250" class-name="small-padding">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="handleEdit(row.id)">
            详情
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">
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
  </div>
</template>

<script>
import { getCourses } from '@/api/course'
import { getContestTemplates, deleteContestTemplate } from '@/api/contest'
import AddButton from '@/components/TableTools/AddButton'
import Pagination from '@/components/Pagination'
import InputSelector from '@/components/InputSelector'
export default {
  name: 'Template',
  components: {
    AddButton,
    Pagination,
    InputSelector
  },
  filters: {
    statusFilter(is_private) {
      return is_private ? '公开' : '非公开'
    }
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
      filterQuery: {
        course: undefined
      },
      getCourses
    }
  },
  activated() {
    this.getTable()
  },
  watch: {
    filterQuery: {
      handler (val, oldVal) {
        this.page = 1
        this.getTable()
      },
      deep: true,
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
      getContestTemplates({ ...this.pageQuery, ...this.filterQuery }).then(({ count, results }) => {
        this.loading = false
        this.total = count
        this.table = results
      })
    },
    handleAdd() {
      this.$router.push({ name: 'AddTemplate' })
    },
    handleDelete(id) {
      this.$confirm('确认删除？')
        .then(_ => {
          deleteContestTemplate(id).then(res => {
            this.$message.success('删除成功')
            this.getTable()
          })
        })
        .catch(_ => {})
    },
    handleEdit(id) {
      this.$router.push({ name: 'EditTemplate', params: { id } })
    }
  },
}
</script>
