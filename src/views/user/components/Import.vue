<template>
  <el-form ref="form" :inline="true" label-position="left" label-width="100px" :model="form">
    <p>左边输入学号，右边输入姓名，换行分隔</p>
    <el-form-item prop="username" :error="formError.username" required>
      <el-input v-model="form.username" placeholder="学号" type="textarea" :rows="5" />
    </el-form-item>
    <el-form-item prop="name" :error="formError.name">
      <el-input v-model="form.name" placeholder="姓名" type="textarea" :rows="5" />
    </el-form-item>
    <div>
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          提交
        </el-button>
      </el-form-item>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="导入结果" append-to-body>
      <h3>导入成功数：<span style="color:green">{{importResult.count}}</span> </h3>
      <h3>导入重复数：<span style="color:red">{{importResult.username_exist.length}}</span> </h3>
      <h3>重复用户名列表：</h3>
      <div class="duplication" v-if="importResult.username_exist.length">
        <p v-for="(item,index) of importResult.username_exist" :key="index">
          {{ item }}
        </p>
      </div>
    </el-dialog>
  </el-form>
</template>

<script>
import formMixins from '@/mixins/formMixin'
import { createUsers } from '@/api/user'
export default {
  mixins: [formMixins],
  data() {
    return {
      form: {
        username: '',
        name: '',
      },
      importResult: {
        count: 0,
        username_exist: [],
        created: []
      },
      dialogVisible: false,
    }
  },
  methods: {
    async submitData() {
      const userList = this.form.username
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean)
      if(!userList.length) {
        this.$message.error('用户名列表为空')
        return
      }
      const nameList = this.form.name
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean)
      const data = { username: userList, name: nameList }
      const res = await createUsers(data)
      this.importResult = res
      this.dialogVisible = true
      this.resetForm()
      this.$emit('fetch')
    },
  },
}
</script>

<style lang="scss" scoped>
.duplication{
  height: 100px;
  overflow-y:auto;
}
</style>
