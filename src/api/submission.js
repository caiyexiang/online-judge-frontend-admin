import ajax from '@/utils/ajax'

export function getSubmissions (params) {
  return ajax.get('code-submission/', params)
}

export function getSubmission (id) {
  return ajax.get('code-submission/' + id + '/')
}

export function getCodeFillSubmissions (params) {
  return ajax.get(`/code-fill-submission/`, params)
}

export function getCodeFillSubmission (id) {
  return ajax.get(`/code-fill-submission/${id}/`)
}

export function getQASubmission (id) {
  return ajax.get(`/manage/qa-submission/${id}/`)
}

export function getContestSubmissions (params) {
  return ajax.get(`/manage/contest-submission/`, params)
}

export function getContestSubmission (id) {
  return ajax.get(`/manage/contest-submission/${id}/`)
}

export function updateContestSubmission (id) {
  return data => ajax.patch(`/manage/contest-submission/${id}/`, data)
}

export function updateQASubmission (id) {
  return data => ajax.patch(`/manage/qa-submission/${id}/`, data)
}
