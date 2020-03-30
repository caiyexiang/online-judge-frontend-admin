import service from './axios'

const typeMap = {
  excel: 'application/vnd.ms-excel',
  text: 'text/txt'
}

export default {
  post: function(url, data) {
    return service({ url, method: 'post', data })
  },
  get: function(url, params) {
    return service({ url, method: 'get', params })
  },
  put: function(url, data) {
    return service({ url, method: 'put', data })
  },
  delete: function(url) {
    return service({ url, method: 'delete' })
  },
  patch: function(url, data) {
    return service({ url, method: 'patch', data })
  },
  download: function(url, type, filename) {
    return service.get(url, { responseType: 'blob' }).then(res => {
      const blob = new Blob([res], {
        type: typeMap[type],
      })
      const downloadUrl = URL.createObjectURL(blob)
      const linkElement = document.createElement('a')
      linkElement.href = downloadUrl
      linkElement.download = filename
      linkElement.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        }),
      )
      window.URL.revokeObjectURL(blob)
    })
  },
}
