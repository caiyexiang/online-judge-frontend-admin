<template>
  <div class="app-container" id="container">
    <el-card class="left">
      <Info />
    </el-card>
    <el-card class="right">
      <Settings />
    </el-card>
  </div>
</template>

<script>
import Info from './components/Info'
import Settings from './components/Settings'
export default {
  name: 'Profile',
  components: {
    Info,
    Settings
  }
}
</script>

<style lang="scss" scoped>
#container {
  display: flex;
  align-items: top;
  .left {
    width: 18%;
    margin-right: 10px;
  }
  .right {
    width: 80%;
  }
}
</style>
