import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param permission
 * @param route
 */
function hasPermission(permission, route) {
  if (route.meta && route.meta.permission !== undefined && typeof route.meta.permission === 'number') {
    return permission <= route.meta.permission
  }
  return true
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param permission
 */
export function filterAsyncRoutes(routes, permission) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permission, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permission)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
}

const actions = {
  generateRoutes({ commit }, permission) {
    return new Promise(resolve => {
      let accessedRoutes
      if (permission === 0) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, permission)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
