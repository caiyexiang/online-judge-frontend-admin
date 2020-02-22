/* eslint-disable vue/valid-template-root */
<script>
import FillInInput from './FillInInput'
import { fillRegEx } from '@/utils/constant'
export default {
  name: 'ContestBlankFilling',
  props: {
    problem: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      default: undefined
    }
  },
  render (createElement) {
    const h = createElement
    const strList = this.problem.description.split(fillRegEx)
    const elements = [h('span', { style: { fontSize: '1.2em' } }, [`【${this.maxScore || this.problem.maxScore}分】 ${this.index}.`])]
    for (let i = 0; i < strList.length; i++) {
      const textEle = h('span', { style: { fontSize: '1.2em' } }, [strList[i]])
      elements.push(textEle)
      if (i < strList.length - 1) {
        const inputEle = h(
          FillInInput,
          {
            props: {
              answer: this.problem.answer[i]
            },
            key: Math.random()
          }
        )
        elements.push(inputEle)
      }
    }
    return createElement(
      'div',
      null,
      elements
    )
  }
}
</script>
