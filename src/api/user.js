import ajax from '@/utils/ajax'

export function login(data) {
  return ajax.post('users/login/', data)
}

export function logout() {
  return ajax.get('users/logout/')
}

export function getInfo(id) {
  return ajax.get(`users/${id}/`)
}

export function changePassword(data) {
  return ajax.post('users/change-password/', data)
}

export function getUsers(params) {
  return ajax.get('/manage/users/', params)
}

export function getUser(id) {
  return ajax.get(`/manage/users/${id}/`)
}

export function createUser(data) {
  return ajax.post('/manage/users/', data)
}

export function createUsers(data) {
  return ajax.post('/manage/users/create-users/', data)
}

export function createTeacher(data) {
  return ajax.post('/manage/users/create-teachers/', data)
}

export function deleteUser(id) {
  return ajax.delete(`/manage/users/${id}/`)
}

export function patchUser(id) {
  return data => ajax.patch(`/manage/users/${id}/`, data)
}

export function updateProfile(id, data) {
  return ajax.patch(`users/${id}/`, data)
}

export function getAssistants(params) {
  return ajax.get('/manage/assistants/', params)
}

export function getAssistant(id) {
  return ajax.get(`/manage/assistants/${id}/`)
}

export function updateAssistant(id) {
  return data => ajax.put(`/manage/assistants/${id}/`, data)
}

export function createAssistant(data) {
  return ajax.post('/manage/assistants/', data)
}

export function deleteAssistant(id) {
  return ajax.delete(`/manage/assistants/${id}/`)
}

export function deleteAssistantClassPermission(id, classId) {
  return ajax.get(`/manage/assistants/${id}/delete-class-permission/?group=${classId}`)
}

export function resetPassword(id) {
  return ajax.get(`/manage/users/${id}/reset-password/`)
}
