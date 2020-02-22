<template>
  <el-select
    :value="value"
    :multiple="multiple"
    filterable
    remote
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="emitChange"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import { getTags } from '@/api/tag'
/**
 * @description 输入时显示下拉选择菜单,默认限制10个.支持v-model，默认情况下是tags的selector.
 * @props {value, fetchApi, multiple, processFunc, fetchParams, limit} 值, 取Option的API, 多选与否, 处理函数把API获取的值转为{value, label}, fetch时额外的params, option数目
 */
export default {
  model: {
    prop: 'value',
    event: 'emitChange'
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, String, Array],
      default: undefined
    },
    fetchApi: {
      type: Function,
      default: getTags
    },
    fetchParams: {
      type: Object,
      default: () => { return {} }
    },
    processFunc: {
      type: Function,
      /**
       * 默认为tag的处理函数
       */
      default: (item) => {
        return { value: item.id, label: item.name }
      }
    },
    limit: {
      type: Number,
      default: 10
    },
    placeholder: {
      type: String,
      default: `输入标签`
    }
  },
  data () {
    return {
      options: [],
      loading: false
    }
  },
  async mounted () {
    const params = {
      limit: this.limit
    }
    Object.assign(params, this.fetchParams)
    const res = await this.fetchApi(params)
    this.options = res.results.map(this.processFunc)
  },
  methods: {
    async remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        let params = {
          limit: this.limit,
          search: query
        }
        Object.assign(params, this.fetchParams)
        const res = await this.fetchApi(params)
        this.loading = false
        this.options = res.results.map(this.processFunc)
      } else {
        this.options = []
      }
    },
    emitChange (val) {
      this.$emit('emitChange', val)
    }
  }
}
</script>
