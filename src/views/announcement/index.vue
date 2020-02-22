<template>
  <div class="app-container">
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
      announcement: ''
    }
  },
  created () {
    getAnnouncement().then(res => {
      this.announcement = res.content
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
