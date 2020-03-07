<template>
  <div class="app-container" v-loading="loading">
    <quill-editor ref="editor" v-model="announcement" :options="{}" />
    <div style="margin-top: 10px;">
      <el-button
        type="primary"
        @click="updateAnnouncement"
      >
        更新公告
      </el-button>
    </div>
  </div>
</template>

<script>
import { getAnnouncement, updateAnnouncement } from '@/api/annoucement'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
export default {
  name: 'Annoucement',
  components: {
    quillEditor
  },
  data () {
    return {
      announcement: '',
      loading: false
    }
  },
  activated () {
    this.loading = true
    getAnnouncement().then(res => {
      this.announcement = res.content
      this.loading = false
    })
  },
  methods: {
    updateAnnouncement () {
      updateAnnouncement({ content: this.announcement }).then(res => {
        this.$message.success('更新成功')
      }).catch(e => {
        this.$message.error('更新失败')
        console.error(e)
      })
    }
  }
}
</script>

<style></style>
