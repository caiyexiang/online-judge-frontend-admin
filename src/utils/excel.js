export function exportExcel () {
  import('@/vendor/Export2Excel').then(excel => {
    excel.export_json_to_excel({
      header: this.exportColumns,
      data: this.exportData,
      filename: this.exportFile,
    })
  })
}
