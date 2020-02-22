<template>
  <div>
    <header>
      <div>
        <el-button type="primary" :loading="loading" @click="exportWord">
          <svg-icon icon-class="excel" />导出试卷
        </el-button>
      </div>
    </header>
    <div id="container">
      <div v-for="type of TYPE_LIST" :key="type">
        <h2>{{PROBLEM_TYPE_CN[type]}}</h2>
        <div v-for="(problem,index) of problems[type]" :key="index" >
          <h4>
            {{ `【${problems_score[type][problem.id]}分】 ${index+1}. `}}
            <span v-if="type===CODING || type===CODEFILL">
              {{ problem.title}}
            </span>
            <span v-if="type===CHOICE">
              {{ problem.description}}
            </span>
            <span v-if="type===QA" v-html="problem.description"/>
            <span v-if="type===FILLIN">
              {{ problem.description | parseFillIn}}
            </span>
          </h4>
          <div>
            <div v-if="type===CODING || type===CODEFILL">
              <span>题目描述：</span>
              <span v-html="problem.description"/>
            </div>
            <p v-if="type===CHOICE">
              {{ problem.choice | parseChoice }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { asBlob } from 'html-docx-js-typescript'
import { saveAs } from 'file-saver'
import { mapGetters } from 'vuex'
import { PROBLEM_TYPE_CN, PROBLEM_ENUM, TYPE_LIST, fillRegEx } from '@/utils/constant'
export default {
  name: 'Preview',
  computed: {
    ...mapGetters(['problems', 'problems_score'])
  },
  data () {
    return {
      TYPE_LIST,
      PROBLEM_TYPE_CN,
      ...PROBLEM_ENUM,
      loading: false
    }
  },
  filters: {
    parseFillIn (value) {
      return value.replace(fillRegEx, '___')
    },
    parseChoice (value) {
      const arr = JSON.parse(value)
      let str = ''
      for (let i = 0; i < arr.length; i++) {
        str += `${String.fromCharCode(i + 65)}.${arr[i]}\n`
      }
      return str
    }
  },
  methods: {
    async exportWord () {
      this.loading = true
      const html = document.getElementById('container').innerHTML
      const data = await asBlob(html, '预览试卷')
      saveAs(data)
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  position: sticky;
  top: 0px;
  background: white;
  border-bottom: 1px solid #e6e6e6;
  z-index: 20;
  div {
    padding: 10px;
  }
}
</style>