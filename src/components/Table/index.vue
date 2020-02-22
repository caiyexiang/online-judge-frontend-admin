<template>
  <el-table v-loading="loading" :data="table" style="width: 100%;" border fit highlight-current-row>
    <el-table-column v-for="(label, prop, index) in columns" :key="index" :label="label" :prop="prop" />
    <el-table-column v-if="table.tags" label="标签">
      <template slot-scope="{ row }">
        <el-tag v-for="tag in row.tags" :key="tag.id">
          {{ tag.name }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      align="center"
      :width="actionsWidth"
      class-name="small-padding"
      v-if="filterButtons.length"
    >
      <template slot-scope="{ row }">
        <el-button
          size="mini"
          v-for="(button, index) in filterButtons"
          :key="index"
          :type="button.type"
          @click="$emit('table-event', button.event, row)"
        >
          {{ button.name }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import store from '@/store'
/**
 * 普通表格组件
 * @props
 * table 表格数据 usage: [{c1:d1,c2:d2}, {c1:d3,c2:d4}]
 * columns 表格头 usage: {column:columnName}
 * buttons 按钮组。demo: [{type:'default',event:'add',name:'添加',pemission:0}]
 */
export default {
  name: 'Table',
  props: {
    table: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Object,
      default: null,
    },
    buttons: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    actionsWidth: {
      type: Number,
      default: 230,
    },
  },
  computed: {
    filterButtons() {
      return this.buttons.filter(item => item.permission === undefined || store.getters.permission <= item.permission)
    },
  },
}
</script>
