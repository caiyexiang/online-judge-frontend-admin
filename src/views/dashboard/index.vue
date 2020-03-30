<template>
  <div class="app-container">
    <!-- TODO: 数据可视化 -->
    <h3>
      欢迎 {{ username }} 用户
      <span v-if="prev_login">, 您的上一次登陆时间是 {{ prev_login | parseTime }}, 登陆地址是 {{ prev_login_ip }} </span>
    </h3>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import { getLocalStorage } from '@/utils/storage'
export default {
  name: 'Dashboard',
  data() {
    return {
      ip: '',
      time: '',
    }
  },
  filters: {
    parseTime
  },
  computed: {
    ...mapGetters(['username', 'prev_login', 'prev_login_ip']),
  }
}
</script>
