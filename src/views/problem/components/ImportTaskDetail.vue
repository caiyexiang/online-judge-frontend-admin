<template>
  <div>
    <table>
      <tr>
        <td>ID</td>
        <td>{{ task.id }}</td>
      </tr>
      <tr>
        <td>用户</td>
        <td>{{ task.user.username }}</td>
      </tr>
      <tr>
        <td>文件名</td>
        <td>{{ task.name }}</td>
      </tr>
      <tr>
        <td>状态</td>
        <td>
          <el-tag :type="statusMap[task.status].type">
            {{ statusMap[task.status].name }}
          </el-tag>
        </td>
      </tr>
      <tr>
        <td>进度</td>
        <td><el-progress :text-inside="true" :stroke-width="24" :percentage="task.progress" /></td>
      </tr>
      <tr>
        <td>任务开始时间</td>
        <td>{{ task.start_time | parseTime }}</td>
      </tr>
      <tr>
        <td>任务结束时间</td>
        <td>{{ task.end_time | parseTime }}</td>
      </tr>
      <tr>
        <td>服务器返回信息</td>
        <td>{{ task.msg }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { getCodeCheckTask } from '@/api/code-check'
import { parseTime } from '@/utils/index'
export default {
  props: {
    task: {
      type: Object,
      default: () => {
        return {
          user: { id: 0, username: '' },
          id: 0,
          username: '',
          name: '',
          progress: 0,
          status: 0,
          msg: '',
          start_time: '',
          end_time: '',
        }
      },
    },
  },
  filters: { parseTime },
  data() {
    return {
      statusMap: {
        '-1': { name: '错误', type: 'danger' },
        '0': { name: '等待中', type: 'info' },
        '1': { name: '进行中', type: '' },
        '2': { name: '已完成', type: 'success' },
      },
    }
  },
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
}
table,
table tr th,
table tr td {
  border: 1px solid #6f6f6f;
}
table {
  border-collapse: collapse;
  line-height: 25px;
}
th,
td {
  padding: 10px;
}
</style>
