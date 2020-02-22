<template>
  <div>
    <p>
      状态：<el-tag :type="statusMap[list.status].type">
        {{ statusMap[list.status].name }}
      </el-tag>
    </p>
    <el-progress :text-inside="true" :stroke-width="24" :percentage="list.progress" />
    <p v-show="list.msg">系统提示：{{ list.msg }}</p>
    <p v-show="list.start_time">任务开始时间：{{ list.start_time | parseTime }}</p>
    <p v-show="list.end_time">任务结束时间：{{ list.end_time | parseTime }}</p>
    <p>查重题目：{{ list.problems }}</p>
    <p>查重范围：{{ list.submission_start_time | parseTime }} - {{ list.submission_end_time | parseTime }}</p>
    <p>发起人：{{ list.user.username }}</p>
    <p>文件相似度阈值：{{ list.td }}</p>
    <p>单行相似度阈值：{{ list.tr }}</p>
  </div>
</template>

<script>
import { getCodeCheckTask } from '@/api/code-check'
import { parseTime } from '@/utils/index'
export default {
  props: {
    id: {
      type: Number,
      default: 0,
    },
  },
  filters: {parseTime},
  watch: {
    id: {
      handler() {
        this.getData()
      },
      immediate: true
    }
  },
  data() {
    return {
      list: {
        status: 0,
        progress: 0,
        msg: '',
        start_time: '',
        end_time: '',
        problems: [],
        submission_start_time: '',
        submission_end_time: '',
        user: {username: ''},
        td: 0,
        tr: 0
      },
      statusMap: {
        0: { name: '等待中', type: 'info' },
        1: { name: '进行中', type: '' },
        2: { name: '已完成', type: 'success' },
      },
    }
  },
  methods: {
    getData() {
      getCodeCheckTask(this.id).then(res => {
        this.list = res
      })
    },
  },
}
</script>
