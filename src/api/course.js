import ajax from '@/utils/ajax'

export function getCourses (params) {
  return ajax.get('/manage/courses/', params)
}

export function updateCourse (id) {
  return data => ajax.put(`/manage/courses/${id}/`, data)
}

export function createCourse (data) {
  return ajax.post('/manage/courses/', data)
}

export function deleteCourse (id) {
  return ajax.delete(`/manage/courses/${id}/`)
}
