import ajax from '@/utils/ajax'

export function getContests (params) {
  return ajax.get('/manage/contests/', params)
}

export function getContest (id) {
  return ajax.get('/manage/contests/' + id + '/')
}

export function updateContest (id) {
  return data => ajax.put(`/manage/contests/${id}/`, data)
}

export function createContest (data) {
  return ajax.post('/manage/contests/', data)
}

export function deleteContest (id) {
  return ajax.delete(`/manage/contests/${id}/`)
}

export function getContestTemplates (params) {
  return ajax.get('/manage/contest-template/', params)
}

export function getContestTemplate (id) {
  return ajax.get(`/manage/contest-template/${id}/`)
}

export function updateContestTemplate (id) {
  return data => ajax.put(`/manage/contest-template/${id}/`, data)
}

export function createContestTemplate (data) {
  return ajax.post('/manage/contest-template/', data)
}

export function deleteContestTemplate (id) {
  return ajax.delete(`/manage/contest-template/${id}/`)
}

export function getRank (id, params) {
  return ajax.get(`/manage/contests/${id}/rank/`, params)
}
