import ajax from '@/utils/ajax'

export function getJudgers (params) {
  return ajax.get('/manage/judger/', params)
}

export function getJudger (id) {
  return ajax.get(`/manage/judger/${id}/`)
}
