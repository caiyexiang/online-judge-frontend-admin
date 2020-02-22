<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-select style="width:120px;" class="filter-item" v-model="type" placeholder="题目类型">
          <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
        <el-select
          style="width:130px;"
          class="filter-item"
          v-show="type === CHOICE"
          v-model="query.multiple"
          placeholder="多选/单选"
          clearable
        >
          <el-option v-for="item in multipleOption" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
        <InputSelector style="width:130px;" class="filter-item" v-model="query.tag" clearable />
        <Search v-model="query.search" class="filter-item" placeholder="输入题目名称搜索" style="width:200px;" />
        <AddButton class="filter-item" @click.native="handleAdd" v-show="route !== 'ProblemSelect'"/>
        <ImportButton class="filter-item" @click.native="handleImport" v-show="(type === CHOICE || type === CODING) && route!== 'ProblemSelect'" />
      </div>
      <!-- 当遇到复杂度比较大的table,可以不使用Table组件 -->
      <!-- 删除按钮设个v-permission就行了，多选类型设个v-if -->
      <el-table v-loading="loading" :data="table" style="width: 100%;" border fit highlight-current-row>
        <el-table-column label="编号" prop="id" width="80" align="center" />
        <el-table-column label="题目" :prop="titleProp" />
        <el-table-column v-if="type === CHOICE" label="类型" prop="multiple" width="100" align="center" />
        <el-table-column label="作者" prop="source" width="100" align="center" />
        <el-table-column label="增加日期" prop="add_date" width="100" align="center" />
        <el-table-column label="难度" prop="difficulty" width="100" align="center">
          <template slot-scope="{ row }">
            <svg-icon v-for="n in +row.difficulty" :key="n" icon-class="star" class="meta-item__icon" />
          </template>
        </el-table-column>
        <el-table-column prop="tag" label="标签" width="130" align="center">
          <template slot-scope="{ row }">
            <el-tag v-for="tag in row.tag" :key="tag.id">
              {{ tag.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" class-name="small-padding" v-if="route!=='ProblemSelect'">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="handleModify(row.id)">
              详情
            </el-button>
            <el-button v-permission="'ADMIN'" size="mini" type="danger" @click="handleDelete(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" class-name="small-padding" v-else>
          <template slot-scope="{ row }">
            <el-button size="mini" type="success" plain @click="handleSelect(type, row)" v-if="!problemInList(type, row.id)">
              选择
            </el-button>
            <el-button size="mini" type="danger" plain @click="handleCancleSelect(type, row.id)" v-else>
              取消选择
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
      <el-dialog :title="`导入${PROBLEM_TYPE_CN[type]}`" :visible.sync="dialogVisible">
        <UploadFile :destination="uploadUrl[type]" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js'
import {
  getProblems,
  getChoices,
  getFillIns,
  getCodeFills,
  getQAs,
  deleteProblem,
  deleteQA,
  deleteCodeFill,
  deleteFillIn,
  deleteChoice,
} from '@/api/problem'
import { PROBLEM_ENUM, PROBLEM_TYPE_CN } from '@/utils/constant'
import InputSelector from '@/components/InputSelector'
import Search from '@/components/TableTools/Search'
import AddButton from '@/components/TableTools/AddButton'
import ImportButton from '@/components/TableTools/ImportButton'
import Pagination from '@/components/Pagination/index'
import UploadFile from './components/UploadFile'

const { CODING, CODEFILL, FILLIN, CHOICE, QA } = PROBLEM_ENUM
const types = Object.keys(PROBLEM_TYPE_CN).map(key => {
  return { name: PROBLEM_TYPE_CN[key], value: Number(key) }
})

const fetchApi = {
  [CODING]: getProblems,
  [CHOICE]: getChoices,
  [FILLIN]: getFillIns,
  [QA]: getQAs,
  [CODEFILL]: getCodeFills,
}
const deleteApi = {
  [CODING]: deleteProblem,
  [CHOICE]: deleteChoice,
  [FILLIN]: deleteFillIn,
  [QA]: deleteQA,
  [CODEFILL]: deleteCodeFill,
}
const editRoute = {
  [CODING]: 'EditCoding',
  [CHOICE]: 'EditChoice',
  [FILLIN]: 'EditFillIn',
  [CODEFILL]: 'EditCodeFill',
  [QA]: 'EditQA',
}
const addRoute = {
  [CODING]: 'AddCoding',
  [CHOICE]: 'AddChoice',
  [FILLIN]: 'AddFillIn',
  [CODEFILL]: 'AddCodeFill',
  [QA]: 'AddQA',
}

export default {
  name: 'Problem',
  components: {
    AddButton,
    ImportButton,
    Pagination,
    Search,
    InputSelector,
    UploadFile
  },
  directives: { permission },
  data() {
    return {
      dialogVisible: false,
      pageQuery: {
        limit: 10,
        offset: 0,
      },
      type: CODING,
      types,
      query: {
        search: undefined,
        tag: undefined,
        multiple: undefined,
      },
      table: [],
      total: 0,
      loading: false,
      multipleOption: [
        { name: '单选+多选', value: undefined },
        { name: '多选', value: true },
        { name: '单选', value: false },
      ],
      uploadUrl: {
        [CODING]: 'manage/problems/fps-import/',
        [CHOICE]: 'manage/choices/import/',
        [FILLIN]: 'manage/fill-in-problems/import/',
      },
      PROBLEM_TYPE_CN,
      ...PROBLEM_ENUM
    }
  },
  activated() {
    this.getTable()
  },
  watch: {
    query: {
      handler: function(val, oldVal) {
        this.page = 1
        this.getTable()
      },
      deep: true,
    },
    type() {
      this.page = 1
      this.query.search = undefined
      this.query.multiple = undefined
      this.query.tag = undefined
      this.getTable()
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
    // 对于编程题和代码补全题，题目是title，其他的是description
    titleProp() {
      if (this.type === CODING || this.type === CODEFILL) {
        return 'title'
      } else {
        return 'description'
      }
    },
    // 给添加问题页面使用
    route () {
      return this.$route.name
    }
  },
  methods: {
    handleModify(id) {
      this.$router.push({ name: editRoute[this.type], params: { id } })
    },
    handleAdd() {
      this.$router.push({ name: addRoute[this.type] })
    },
    handleImport() {
      this.dialogVisible = true
    },
    handleDelete(id) {
      this.$confirm('确认删除？')
        .then(_ => {
          deleteApi[this.type](id).then(res => {
            this.$message.success('删除成功')
            this.getTable()
          })
        })
        .catch(_ => {})
    },
    handleSelect (type, problem) {
      this.$store.commit('problem/ADD_PROBLEM', {type, problem})
      this.$store.commit('problem/SET_PROBLEM_SCORE',  {type, id: problem.id, value: 0})
    },
    handleCancleSelect (type, id) {
      this.$store.commit('problem/DELETE_PROBLEM', {type, id})
      this.$store.commit('problem/DELETE_PROBLEM_SCORE',  {type, id})
    },
    problemInList (type, id) {
      return this.$store.getters.problems[type].findIndex(item => item.id === id) !== -1
    },
    getTable() {
      this.loading = true
      const params = {}
      Object.keys(this.query).forEach(key => {
        if (this.query[key] !== undefined && this.query[key] !== '') {
          params[key] = this.query[key]
        }
      })
      fetchApi[this.type]({ ...params, ...this.pageQuery }).then(({ count, results }) => {
        this.total = count
        this.table = results
        this.loading = false
      })
    }
  },
}
</script>
