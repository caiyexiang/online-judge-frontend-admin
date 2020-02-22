import ajax from '@/utils/ajax'

export function getLogs (params) {
  return ajax.get('manage/log/', params)
}
