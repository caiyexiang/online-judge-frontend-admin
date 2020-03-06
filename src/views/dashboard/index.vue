<template>
  <div class="app-container">
    <!-- TODO: 登陆时间和登陆地点/以及数据可视化 -->
    <h2>欢迎 {{ username }} 来到深圳大学在线判题系统后台管理端。</h2>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['username'])
  }
}
</script>
