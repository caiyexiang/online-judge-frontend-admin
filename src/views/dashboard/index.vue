<template>
  <div class="app-container">
    <!-- TODO: 数据可视化 -->
    <h3>
      欢迎 {{ username }} 用户
      <span v-if="ip">, 您的上一次登陆时间是 {{ time | parseTime }}, 登陆地址是 {{ ip }} </span>
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
    ...mapGetters(['username', 'id']),
  },
  created() {
    this.ip = getLocalStorage('last_login_ip')
    this.time = getLocalStorage('last_login_time')
  }
}
</script>
