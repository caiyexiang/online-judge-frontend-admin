<template>
  <div>
    <table class="task-log-table">
      <tr>
        <td>用户</td>
        <td>{{ data.submission_a.user.username }}</td>
        <td>{{ data.submission_b.user.username }}</td>
      </tr>
      <tr>
        <td>提交时间</td>
        <td>{{ data.submission_a.time | parseTime }}</td>
        <td>{{ data.submission_b.time | parseTime }}</td>
      </tr>
      <tr>
        <td>测验</td>
        <td>{{ data.submission_a.contest }}</td>
        <td>{{ data.submission_b.contest }}</td>
      </tr>
      <tr>
        <td>问题</td>
        <td>{{ data.submission_a.problem }}</td>
        <td>{{ data.submission_a.problem }}</td>
      </tr>
      <tr>
        <td>代码</td>
        <td>
          <CodeMirror
            :value="data.submission_b.code"
            :language="data.submission_b.language"
            :read-only="true"
            :auto-focus="false"
            :disableLanguage="true"
          />
        </td>
        <td>
          <CodeMirror
            :value="data.submission_b.code"
            :language="data.submission_b.language"
            :read-only="true"
            :auto-focus="false"
            :disableLanguage="true"
          />
        </td>
      </tr>
      <tr>
        <td>文本相似度</td>
        <td colspan="2">{{ data.dfg_similarity }}</td>
      </tr>
      <tr>
        <td>结构相似度</td>
        <td colspan="2">{{ data.cfg_similarity }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { getCodeCheckLog } from '@/api/code-check'
import CodeMirror from '@/components/CodeMirror'
export default {
  components: {
    CodeMirror,
  },
  filters: {
    parseTime
  },
  props: {
    id: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      data: null,
    }
  },
  watch: {
    id: {
      handler() {
        this.getData()
      },
      immediate: true,
    },
  },
  methods: {
    getData() {
      getCodeCheckLog(this.id).then(res => {
        this.data = res
      })
    },
  },
}
</script>

<style lang="scss" scoped>
  table,
  table tr th,
  table tr td {
    border:1px solid #6f6f6f;
  }
  table {
    border-collapse: collapse;
    line-height: 25px;
  }
  th, td {
    padding: 10px;
  }
</style>
