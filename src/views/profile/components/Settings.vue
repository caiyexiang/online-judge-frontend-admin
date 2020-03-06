<template>
  <el-tabs>
    <el-tab-pane label="修改密码">
      <ChangePassword />
    </el-tab-pane>
    <el-tab-pane label="修改资料">
      <ChangeProfile />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  components: {
    ChangePassword: () => import('./ChangePassword'),
    ChangeProfile: () => import('./ChangeProfile')
  }
}
</script>
