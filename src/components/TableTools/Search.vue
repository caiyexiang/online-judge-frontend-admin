<template>
  <el-input
    v-bind="$attrs"
    v-on="$listeners"
    prefix-icon="el-icon-search"
    clearable
    width="120"
  />
</template>

<script>
import { _debounce } from '@/utils'
export default {
  name: 'Search'
}
</script>
