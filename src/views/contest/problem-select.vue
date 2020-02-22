<template>
  <div>
    <main>
      <div class="left">
        <el-button type="success" style="width:90%;margin:20px;" @click="goBack">
          确定选择
        </el-button>
        <keep-alive>
          <ProblemList />
        </keep-alive>
      </div>
      <div class="right">
        <keep-alive>
          <Problem />
        </keep-alive>
      </div>
    </main>
  </div>
</template>

<script>
import Problem from '@/views/problem/index'
import ProblemList from '@/views/contest/components/ProblemList'
export default {
  name: 'ProblemSelect',
  components: {
    Problem,
    ProblemList,
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  box-sizing: border-box;
  & .right {
    height: 100vh;
    overflow: hidden;
  }
  & .left {
    height: 100vh;
    float: left;
    width: 350px;
    height: 100vh;
    padding: 5px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
