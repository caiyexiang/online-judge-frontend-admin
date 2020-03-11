import ajax from '@/utils/ajax'

export function getProblems (params) {
  return ajax.get('/manage/problems/', params)
}

export function getProblem (id) {
  return ajax.get(`/manage/problems/${id}/`)
}

export function createProblem (data) {
  return ajax.post('/manage/problems/', data)
}

export function updateProblem (id) {
  return data => ajax.put(`/manage/problems/${id}/`, data)
}

export function deleteProblem (id) {
  return ajax.delete(`/manage/problems/${id}/`)
}

export function getChoices (params) {
  return ajax.get('/manage/choices/', params)
}

export function deleteChoice (id) {
  return ajax.delete(`/manage/choices/${id}/`)
}

export function getChoice (id) {
  return ajax.get(`/manage/choices/${id}/`)
}

export function updateChoice (id) {
  return data => ajax.put(`/manage/choices/${id}/`, data)
}

export function createChoice (data) {
  return ajax.post(`/manage/choices/`, data)
}

export function getFillIns (params) {
  return ajax.get('/manage/fill-in-problems/', params)
}

export function deleteFillIn (id) {
  return ajax.delete(`/manage/fill-in-problems/${id}/`)
}

export function getFillIn (id) {
  return ajax.get(`/manage/fill-in-problems/${id}/`)
}

export function updateFillIn (id) {
  return data => ajax.put(`/manage/fill-in-problems/${id}/`, data)
}

export function createFillIn (data) {
  return ajax.post(`/manage/fill-in-problems/`, data)
}

export function getQAs (params) {
  return ajax.get(`/manage/qa-problems/`, params)
}

export function getQA (id) {
  return ajax.get(`/manage/qa-problems/${id}/`)
}

export function createQA (data) {
  return ajax.post(`/manage/qa-problems/`, data)
}

export function deleteQA (id) {
  return ajax.delete(`/manage/qa-problems/${id}/`)
}

export function updateQA (id) {
  return data => ajax.put(`/manage/qa-problems/${id}/`, data)
}

export function getCodeFills (params) {
  return ajax.get(`/manage/code-fill-problems/`, params)
}

export function getCodeFill (id) {
  return ajax.get(`/manage/code-fill-problems/${id}/`)
}

export function createCodeFill (data) {
  return $ajax.post(`/manage/code-fill-problems/`, data)
}

export function deleteCodeFill (id) {
  return ajax.delete(`/manage/code-fill-problems/${id}/`)
}

export function updateCodeFill (id) {
  return data => ajax.put(`/manage/code-fill-problems/${id}/`, data)
}

export function downloadProblemTemplate (filename) {
  return ajax.download(`/download/problem_template.xls`, 'excel', filename)
}

export function getImportTasks(params) {
  return ajax.get(`/manage/import-task/`, params)
}
