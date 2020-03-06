import {setLocalStorage, getLocalStorage} from '@/utils/storage'

const state = {
  sidebar: {
    closed: Boolean(getLocalStorage('sidebarStatus')),
    withoutAnimation: false
  }
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.closed = !state.sidebar.closed
    state.sidebar.withoutAnimation = false
    if (state.sidebar.closed) {
      setLocalStorage('sidebarStatus', '1')
    } else {
      setLocalStorage('sidebarStatus', false)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    setLocalStorage('sidebarStatus', false)
    state.sidebar.closed = false
    state.sidebar.withoutAnimation = withoutAnimation
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
