import ajax from '@/utils/ajax'

export function getAnnouncement (id) {
  return ajax.get(`/manage/announcement/${id}/`)
}

export function updateAnnouncement (id) {
  return data => ajax.put(`/manage/announcement/${id}/`, data)
}
