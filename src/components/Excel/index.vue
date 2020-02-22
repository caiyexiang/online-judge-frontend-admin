<template>
  <el-button :loading="loading" v-bind="$attrs" @click="exportExcel">
    <svg-icon icon-class="excel" /> 导出Excel
  </el-button>
</template>

<script>
export default {
  props: {
    table: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    filename: {
      type: String,
      default: '导出文件'
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    exportExcel () {
      this.loading = true
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: this.columns,
          data: this.table,
          filename: this.filename,
        })
        this.loading = false
      })
    }
  }
}
</script>
