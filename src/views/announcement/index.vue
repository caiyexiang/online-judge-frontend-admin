<template>
  <div class="app-container" v-loading="loading">
    <el-radio-group v-model="type" @change="getPage" style="margin-bottom: 10px">
      <el-radio-button label="公告"></el-radio-button>
      <el-radio-button label="FAQ"></el-radio-button>
    </el-radio-group>
    <quill-editor ref="editor" v-model="announcement" :options="{}" />
    <div style="margin-top: 10px;">
      <el-button type="primary" @click="updateAnnouncement">
        更新
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
    quillEditor,
  },
  data() {
    return {
      announcement: '',
      loading: false,
      type: '公告',
    }
  },
  computed: {
    id() {
      switch (this.type) {
        case '公告':
          return 1
        case 'FAQ':
          return 2
      }
    },
  },
  activated() {
    this.getPage()
  },
  methods: {
    getPage() {
      this.loading = true
      getAnnouncement(this.id).then(res => {
        this.announcement = res.content
        this.loading = false
      })
    },
    updateAnnouncement() {
      updateAnnouncement(this.id)({ content: this.announcement })
        .then(res => {
          this.$message.success('更新成功')
        })
        .catch(e => {
          this.$message.error('更新失败')
          console.error(e)
        })
    },
  },
}
</script>

<style></style>
