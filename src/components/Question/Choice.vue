<template>
  <div>
    <h3>
      {{ `${index}.【${maxScore || problem.maxScore}分】 ${problem.description}` }}
    </h3>
    <el-checkbox-group
      v-if="multiple"
      v-model="problem.answer"
    >
      <el-checkbox
        v-for="(value, index) in problem.options"
        :key="index"
        :label="index"
        class="choice-option"
      >
        {{ String.fromCharCode(65 + index) }}. {{ value }}
      </el-checkbox>
    </el-checkbox-group>
    <el-radio-group
      v-else
      v-model="problem.answer[0]"
    >
      <el-radio
        v-for="(value, index) in problem.options"
        :key="index"
        :label="index"
        class="choice-option"
      >
        {{ String.fromCharCode(65 + index) }}. {{ value }}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import { fillRegEx } from '@/utils/constant'
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
  computed: {
    multiple () {
      return this.problem.answer.length > 1
    }
  }
}
</script>

<style>
.choice-option {
  display: block;
  margin-bottom: 8px;
}
</style>
