import ajax from '@/utils/ajax'

export function getAnnouncement () {
  return ajax.get('/manage/announcement/1/')
}

export function updateAnnouncement (data) {
  return ajax.put('/manage/announcement/1/', data)
}
