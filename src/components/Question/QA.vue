<template>
  <div>
    <el-card
      shadow="never"
    >
      <h3>
        {{ `${index}.【${maxScore || problem.maxScore}分】` }}
      </h3>
      <el-tag
        type="danger"
        disable-transitions
        v-if="problem.status"
      >
        {{ problem.status }}
      </el-tag>
      <div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-html="problem.description" />
      </div>
      <el-input
        :value="problem.answer"
        type="textarea"
      />
    </el-card>
    <el-card
      class="card"
    >
      <h3>教师评语</h3>
      <div>
        <div>
          <el-input
            v-model="comment"
            class="reviewInput"
          />
          <el-button
            type="success"
            @click="handleCommentSubmit"
          >
            提交评语
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { updateQASubmission } from '@/api/submission'
export default {
  props: {
    problem: {
      type: Object,
      default: null
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
      comment: this.problem.comment || ''
    }
  },
  methods: {
    async handleCommentSubmit () {
      try {
        await updateQASubmission(this.problem.submissionId)({ comment: this.comment })
        this.$message.success('提交评语成功')
      } catch (e) {
        this.$message.error(e)
      }
    }
  }
}
</script>

<style>
.card {
  margin-top: 10px;
}
.text-wrapper {
  white-space: pre-wrap;
}
.reviewInput {
  margin-bottom: 10px;
}
</style>
