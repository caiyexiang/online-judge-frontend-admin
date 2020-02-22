<template>
  <input
    disabled
    v-model="answer"
    type="text"
    class="fillInput"
    :style="calcWidth"
  >
</template>

<script>
export default {
  name: 'ContestBlankFillingInput',
  props: {
    answer: {
      type: String,
      default: ''
    }
  },
  computed: {
    calcWidth () {
      let len = 0
      for (let c of this.answer) {
        // eslint-disable-next-line no-control-regex
        if (c.match(/[^\x00-\xff]/)) {
          len += 22
        } else {
          len += 22 * 0.6
        }
      }
      return { width: len > 66 ? `${len}px` : '66px' }
    }
  }
}
</script>

<style lang="scss" scoped>
.fillInput {
  font-family: monospace;
  font-weight: 600;
  font-size: 22px;
  border: 0;
  border-bottom: 1px solid grey;
  outline: none;
  text-align: center;
}
</style>
