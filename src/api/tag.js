import ajax from '@/utils/ajax'

export function getTags (params) {
  return ajax.get('/manage/tags/', params)
}

export function getTag (id) {
  return ajax.get(`/manage/tags/${id}/`)
}

export function updateTag (id) {
  return data => ajax.put(`/manage/tags/${id}/`, data)
}

export function createTag (data) {
  return ajax.post('/manage/tags/', data)
}

export function deleteTag (id) {
  return ajax.delete(`/manage/tags/${id}/`)
}
