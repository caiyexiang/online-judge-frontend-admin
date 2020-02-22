
<template>
  <component :is='componentIs' v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    componentIs () {
      return isExternal(this.to) ? 'a' : 'router-link'
    }
  },
  methods: {
    linkProps(url) {
      if (isExternal(url)) {
        return {
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: url
      }
    }
  }
}
</script>
