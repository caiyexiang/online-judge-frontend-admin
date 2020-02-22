<template>
  <div>
    <el-button @click="handleClick">
      <svg-icon icon-class="excel" /> 导出word
    </el-button>
  </div>
</template>

<script>
import { PROBLEM_ENUM, fillRegEx } from '@/utils/constant'
import { asBlob } from 'html-docx-js-typescript'
import fileSaver from 'file-saver'
const { CODING, CHOICE, FILLIN, CODEFILL, QA } = PROBLEM_ENUM
const template1 = `<!DOCTYPE html>
                  <html lang="en">
                  <!-- 此模板用于生成word文档 -->
                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <meta http-equiv="X-UA-Compatible" content="ie=edge">
                      <title>Document</title>
                  </head>
                  <body>`
const template2 = `</body>
                  </html>`
export default {
  name: 'ExportWord',
  props: {
    problems: {
      type: Object,
      default: () => { return { [CODING]: [], [CHOICE]: [], [FILLIN]: [], [CODEFILL]: [], [QA]: [] } }
    },
    user: {
      type: Number,
      default: 0
    },
    contestId: {
      type: Number,
      default: 0
    }
  },
  computed: {
    filename () {
      return `学生${this.user}-测验${this.contestId}-试卷导出.docx`
    }
  },
  methods: {
    async handleClick () {
      const data = await asBlob(this.genHTML())
      fileSaver.saveAs(data, `${this.filename}.docx`)
    },
    genHTML () {
      let html = template1
      html += `<h2> 学生ID ${this.user} 在测验 ${this.contestId} 的导出试卷 </h2>`
      html += `<h3>一、选择题</h3>`
      for (let i = 0; i < this.problems[CHOICE].length; i++) {
        const problem = this.problems[CHOICE][i]
        const ansFlag = problem.isMultiple ? `√` : `◉`
        const options = []
        html += `<div>`
        html += `<h4>(得分${problem.score}/满分${problem.maxScore}) ${i + 1}. ${problem.description} </h4>`
        for (let i = 0; i < problem.options.length; i++) {
          options[i] = `${String.fromCharCode(65 + i)}.${problem.options[i]}`
        }
        for (let ans of problem.answer) {
          options[ans] = ansFlag + options[ans]
        }
        html += options.map(item => `<p style="margin-right:10px">${item}</p>`).join('')
        html += `</div>`
      }
      html += `<h3>二、填空题</h3>`
      for (let i = 0; i < this.problems[FILLIN].length; i++) {
        const problem = this.problems[FILLIN][i]
        const strList = problem.description.split(fillRegEx)
        let descriptionStr = ''
        for (let j = 0; j < strList.length - 1; j++) {
          descriptionStr += (strList[j] + `(${problem.answer[j] ? problem.answer[j] : ''})`)
        }
        descriptionStr += strList[strList.length - 1]
        html += `<div><h4>(得分${problem.score}/满分${problem.maxScore}) ${i + 1}. ${descriptionStr}</h4></div>`
      }
      html += `<h3>三、问答题</h3>`
      for (let i = 0; i < this.problems[QA].length; i++) {
        const problem = this.problems[QA][i]
        html += `<div>`
        html += `<h4>(得分${problem.score}/满分${problem.maxScore}) ${i + 1}. ${problem.description} </h4>`
        html += `<p>答：${problem.answer}</p>`
        html += `<p style="color:red">教师评语: ${problem.comment}</p>`
        html += `</div>`
      }
      html += template2
      return html
    }
  }
}
</script>
