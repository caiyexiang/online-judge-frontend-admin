import store from '@/store'
import { PERMISSION_ENUM } from '@/utils/constant'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const needPermission = PERMISSION_ENUM[value]
    const permission = store.getters && store.getters.permission

    if (needPermission === 0 || needPermission) {
      const hasPermission = permission <= needPermission

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need permission! Like v-permission="1"`)
    }
  }
}
