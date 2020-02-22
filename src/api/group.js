import ajax from '@/utils/ajax'

export function getGroups (params) {
  return ajax.get('/manage/groups/', params)
}

export function getGroup (id) {
  return ajax.get(`/manage/groups/${id}/`)
}

export function createGroup (data) {
  return ajax.post('/manage/groups/', data)
}

export function updateGroup (id) {
  return data => ajax.put(`/manage/groups/${id}/`, data)
}

export function deleteGroup (id) {
  return ajax.delete(`/manage/groups/${id}/`)
}

export function resetPassword (id) {
  return data => ajax.post(`/manage/groups/${id}/reset-password/`, data)
}
