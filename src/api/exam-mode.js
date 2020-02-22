import ajax from '@/utils/ajax'

export function resetIp (username) {
  return ajax.get(`/manage/users/reset-ip/?username=${username}`)
}

export function getExamMode (id) {
  return ajax.get(`/manage/exam-mode/${id}/`)
}

export function updateExamMode (id) {
  return data => ajax.put(`/manage/exam-mode/${id}/`, data)
}
