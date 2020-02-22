import Vue from 'vue'
import { Message } from 'element-ui'
import { getDefaultProblem, getDefaultScore } from '@/utils'

const state = {
  problems: getDefaultProblem(),
  problems_score: getDefaultScore(),
  load_flag: true
}

/**
 * 按钮 随机出题 / 添加问题 / 分数助手 / 分数
 * problemList - 更换problems的位置后 SET_PROBLEMS
 * problemList - 删除问题后 DELETE_PROBLEM + DELETE_SCORE
 * problemList - 设置分数后 SET_PROBLEM_SCORE
 * 随机出题直接SET_Problems 分数助手直接 SET_PROBLEMS_SCORE
 *
 * 在route.name === 'add-problem' 时 随机出题 / 添加问题 / 分数助手 / 分数 全部被隐藏
 *
 * 按钮 添加/导入/删除/ 在route时被隐藏  详情/ + / -  在route时保留
 * 收藏栏抽屉在 route时保留 并且有提示红点 点击确认go(-1)
 * 题库组件 - 添加问题后 ADD_PROBLEM + ADD_SCORE
 * 题库组件 - 删除问题后 DELETE_PROBLEM + DELETE_SCORE
 */
const mutations = {
  RESET_PROBLEMS: (state) => {
    state.problems = defaultProblems
  },
  RESET_PROBLEMS_SCORE: (state) => {
    state.problems_score = defaultProblemsScore
  },
  SET_PROBLEMS: (state, problems) => {
    state.problems = problems
  },
  SET_PROBLEMS_SCORE: (state, problems_score) => {
    state.problems_score = problems_score
  },
  ADD_PROBLEM: (state, {type, problem}) => {
    const problemArr = state.problems[type]
    const pos = problemArr.findIndex(item => item.id===problem.id)
    if (pos === -1) {
      problemArr.push(problem)
      Vue.set(state.problems, type, problemArr)
    } else {
      Message.error(`添加问题: ${problem.id} 重复`)
    }
  },
  DELETE_PROBLEM: (state, {type, id}) => {
    const problemArr = state.problems[type]
    const pos = problemArr.findIndex(item => item.id===id)
    if(pos !== -1) {
      problemArr.splice(pos, 1)
      Vue.set(state.problems, type, problemArr)
    } else {
      Message.error(`删除问题: ${problem.id} 不存在`)
    }
  },
  SET_PROBLEM_SCORE: (state, {type, id, value}) => {
    const scoreObj = {...state.problems_score[type]}
    scoreObj[id] = value
    Vue.set(state.problems_score, type, scoreObj)
  },
  DELETE_PROBLEM_SCORE: (state, {type, id}) => {
    const scoreObj = {...state.problems_score[type]}
    delete scoreObj[id]
    Vue.set(state.problems_score, type, scoreObj)
  },
  SET_LOAD_FLAG: (state, flag) => {
    state.load_flag = flag
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
