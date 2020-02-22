<template>
  <el-card class="card">
    <div class="avatar-container">
      <img src="@/assets/images/avatar.svg" class="avatar">
    </div>
    <div class="data-container">
      <p><strong>{{ username }}</strong></p>
      <p>{{ PERMISSION_TYPE[permission] }}</p>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { PERMISSION_TYPE } from '@/utils/constant'
export default {
  name: 'ProfileCard',
  data () {
    return {
      PERMISSION_TYPE
    }
  },
  computed: {
    ...mapGetters(['username', 'userid', 'permission'])
  }
}
</script>

<style lang="scss" scoped>
.card {
  width: 18%;
  box-sizing: border-box;
  .avatar-container {
    width: 100%;
    .avatar {
      width: 40%;
      height: 40%;
      display: block;
      margin: 0 auto;
    }
  }
  .data-container {
    width: 100%;
    p {
      text-align: center;
    }
  }
}
</style>