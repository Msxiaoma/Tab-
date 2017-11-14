window.ajax = function (option) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      let method = option.method || 'POST'
      xhr.open(method, option.url)
      if (option.data && method === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/json')
      }
      for (let key in (option.headers || {})) {
        xhr.setRequestHeader(key, option[key])
      }
      xhr.onload = () => {
        if ((xhr.status + '').startsWith('4') || (xhr.status + '').startsWith('5')) {
          return reject(xhr)
        }
        try {
          let data = JSON.stringify(xhr.responseText)
          resolve(data)
        } catch (error) {
          reject(error)
        }
      }
      xhr.onerror = error => {
        reject(error)
      }
      xhr.send(JSON.stringify(option.data))
    })
  }