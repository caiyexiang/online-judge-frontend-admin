<template>
  <div>
    <h3>
      {{ `${index}.【${maxScore || problem.maxScore}分】 ${problem.title}` }}
      <el-button size="mini" @click="show = !show">
        {{ show ? '收起题目' : '展开题目' }}
      </el-button>
    </h3>
    <div v-if="show">
      <el-card class="content" shadow="never">
        <div slot="header" class="clearfix">
          <span>题目描述</span>
        </div>
        <div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-html="problem.description" />
        </div>
      </el-card>
      <el-card v-if="problem.hint" class="content" shadow="never">
        <div slot="header" class="clearfix">
          <span>提示</span>
        </div>
        <div class="text-wrapper">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-html="problem.hint" />
        </div>
      </el-card>
      <el-card class="content" shadow="never">
        <div slot="header" class="clearfix">
          <span>示例输入</span>
        </div>
        <div class="text-wrapper">
          <span style="background:#B5F3FF;">{{ problem.demoInput }}</span>
        </div>
      </el-card>
      <el-card class="content" shadow="never">
        <div slot="header" class="clearfix">
          <span>示例输出</span>
        </div>
        <div class="text-wrapper">
          <span style="background:#B5F3FF;">{{ problem.demoOutput }}</span>
        </div>
      </el-card>
    </div>
    <div style="margin-bottom:10px">
      <el-tag
        :type="problem.status === 'Accepted' ? 'success' : 'danger'"
        disable-transitions
        style="margin-right: 10px"
      >
        {{ problem.status }}
      </el-tag>
      <el-button size="mini" @click="openDetailWindow" v-if="hasSubmission" type="primary">
        查看详情
      </el-button>
      <el-button size="mini" @click="openDialog" v-if="hasSubmission" type="primary">
        查看历史提交
      </el-button>
    </div>
    <CodeMirror
      :value="problem.answer"
      :language="problem.language"
      :read-only="true"
      :auto-focus="false"
      :disable-language="true"
    />
    <el-dialog title="编程题提交列表" :visible.sync="dialogVisible">
      <CodeSubmission :query="query" @close="dialogVisible = false" />
    </el-dialog>
  </div>
</template>

<script>
import openWindow from '@/utils/open-window'
import CodeMirror from '@/components/CodeMirror'
import CodeSubmission from '@/views/contest/review/components/CodeSubmission'
import { PROBLEM_ENUM } from '@/utils/constant'
const { CODING, CODEFILL } = PROBLEM_ENUM
export default {
  components: {
    CodeMirror,
    CodeSubmission
  },
  props: {
    problem: {
      type: Object,
      default: () => {
        return {}
      },
    },
    index: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      default: undefined,
    },
  },
  computed:{
    query () {
      return this.problem.user && { problem: this.problem.id, search: this.problem.user.username, status: '' }
    },
    hasSubmission () {
      return this.problem.submissionId !== -1
    }
  },
  data() {
    return {
      show: false,
      detailName: {
        [CODING]: 'code-submission',
        [CODEFILL]: 'code-fill-submission',
      },
      dialogVisible: false,
    }
  },
  methods: {
    openDetailWindow() {
      openWindow(`/${this.detailName[this.problem.type]}/${this.problem.submissionId}/`)
    },
    openDialog() {
      this.dialogVisible = true
    },
  },
}
</script>

<style>
.content {
  margin-bottom: 10px;
}
.text-wrapper {
  white-space: pre-wrap;
}
</style>
