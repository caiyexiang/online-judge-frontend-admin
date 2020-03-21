<template>
  <div class="app-container">
    <div class="filter-container">
      <Search v-model="filterQuery.search" class="filter-item" placeholder="输入测验名称搜索" style="width:200px;" />
      <el-select class="filter-item" clearable v-model="filterQuery.is_exam" placeholder="测验+考试">
        <el-option label="考试" :value="true" />
        <el-option label="测验" :value="false" />
      </el-select>
      <InputSelector
        style="width:130px;"
        class="filter-item"
        v-model="filterQuery.group"
        :fetch-api="getGroups"
        clearable
        placeholder="全部班级"
      />
      <AddButton class="filter-item" @click.native="handleAdd" v-permission="'TEACHER'" />
    </div>
    <el-table v-loading="loading" :data="table" style="width: 100%;" border fit highlight-current-row>
      <el-table-column label="编号" prop="id" width="80" align="center" />
      <el-table-column label="名称" prop="title" align="center" />
      <el-table-column label="班级" prop="group.name" align="center" />
      <el-table-column label="开始时间" prop="begin_time" width="100" align="center">
        <template slot-scope="{ row }">
          {{ row.begin_time | parseTime }}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" prop="end_time" width="100" align="center">
        <template slot-scope="{ row }">
          {{ row.end_time | parseTime }}
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="is_exam" width="100" align="center">
        <template slot-scope="{ row }">
          <el-tag>
            {{ row.is_exam | typeFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding">
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="success"
            @click="handleReview(row.id)"
            v-if="row.scored_status !== 'waiting' && row.scored_status !== 'running'"
          >
            批阅
          </el-button>
          <el-tooltip placement="top" v-else :disabled="false">
            <div slot="content">
              测验结束10分钟后可以进行人工批阅
            </div>
            <span style="margin-right:5px;">
              <el-button size="mini" type="success" :disabled="true">
              等待机评
              </el-button>
            </span>
          </el-tooltip>
          <el-button v-permission="'TEACHER'" size="mini" type="primary" @click="handleEdit(row.id)">
            详情
          </el-button>
          <el-button v-permission="'TEACHER'" size="mini" type="danger" @click="handleDelete(row.id)">
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
import { getGroups } from '@/api/group'
import { getContests, deleteContest } from '@/api/contest'
import { parseTime } from '@/utils'
import Search from '@/components/TableTools/Search'
import AddButton from '@/components/TableTools/AddButton'
import Pagination from '@/components/Pagination'
import InputSelector from '@/components/InputSelector'
import permission from '@/directive/permission'
export default {
  name: 'Contest',
  components: {
    AddButton,
    Pagination,
    InputSelector,
    Search,
  },
  directives: { permission },
  filters: {
    typeFilter(is_exam) {
      return is_exam ? '考试' : '测验'
    },
    parseTime,
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
        group: undefined,
        search: undefined,
        is_exam: undefined,
      },
      getGroups,
    }
  },
  activated() {
    this.getTable()
  },
  watch: {
    filterQuery: {
      handler(val, oldVal) {
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
      getContests({ ...this.pageQuery, ...this.filterQuery }).then(({ count, results }) => {
        this.loading = false
        this.total = count
        this.table = results
      })
    },
    handleAdd() {
      this.$router.push({ name: 'AddContest' })
    },
    handleDelete(id) {
      this.$confirm('确认删除？')
        .then(_ => {
          deleteContest(id).then(res => {
            this.$message.success('删除成功')
            this.getTable()
          })
        })
        .catch(_ => {})
    },
    handleEdit(id) {
      this.$router.push({ name: 'EditContest', params: { id } })
    },
    handleReview(id) {
      this.$router.push({ name: 'Review', params: { contest: id } })
    },
  },
}
</script>
