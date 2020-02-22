import ajax from '@/utils/ajax'

export function getCodeCheckTasks (params) {
  return ajax.get('/manage/code-check-task/', params)
}

export function getCodeCheckTask (id) {
  return ajax.get(`/manage/code-check-task/${id}/`)
}

export function createCodeCheckTask (data) {
  return ajax.post('/manage/code-check-task/', data)
}

export function deleteCodeCheckTask (id) {
  return ajax.delete(`/manage/code-check-task/${id}/`)
}

export function getCodeCheckLogs (params) {
  return ajax.get('/manage/code-check-task-log/', params)
}

export function getCodeCheckLog (id) {
  return ajax.get(`/manage/code-check-task-log/${id}/`)
}

