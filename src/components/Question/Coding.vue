<template>
  <div>
    <h3>
      {{ `${index}.【${maxScore || problem.maxScore}分】 ${problem.title}` }}  
      <el-button
        size="mini"
        @click="show = !show"
      >
        {{ show?'收起题目':'展开题目' }}
      </el-button>
    </h3>
    <div v-if="show">
      <el-card
        class="content"
        shadow="never"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>题目描述</span>
        </div>
        <div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-html="problem.description" />
        </div>
      </el-card>
      <el-card
        v-if="problem.hint"
        class="content"
        shadow="never"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>提示</span>
        </div>
        <div class="text-wrapper">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-html="problem.hint" />
        </div>
      </el-card>
      <el-card
        class="content"
        shadow="never"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>示例输入</span>
        </div>
        <div class="text-wrapper">
          <span style="background:#B5F3FF;">{{ problem.demoInput }}</span>
        </div>
      </el-card>
      <el-card
        class="content"
        shadow="never"
      >
        <div
          slot="header"
          class="clearfix"
        >
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
      <el-button
        size="mini"
        @click="showOutput"
      >
        查看输出
      </el-button>
    </div>
    <CodeMirror
      :value="problem.answer"
      :language="problem.language"
      :read-only="true"
      :auto-focus="false"
      :disable-language="true"
    />
  </div>
</template>

<script>
import CodeMirror from '@/components/CodeMirror'
export default {
  components: {
    CodeMirror
  },
  props: {
    problem: {
      type: Object,
      default: () => { return {} }
    },
    index: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      default: undefined
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    showOutput () {
      this.$alert(this.problem.output, '输出', {
        dangerouslyUseHTMLString: true
      })
    }
  }
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
