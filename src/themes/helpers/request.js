import config from 'config'

export default function request ({ url, params = {}, body = null, method = null }) {
  const options = {
    method: method || body ? 'POST' : 'GET',
    mode: 'cors',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  }

  if (body) {
    options.body = JSON.stringify(body)
  }
  if (!url.startsWith('http')) {
    url = url.startsWith('/') ? url : `/${url}`
    url = new URL(config.api.proxy + url)
  }
  url.search = new URLSearchParams(Object.assign({}, { size: 1000 }, params))
  return fetch(url, options).then(res => {
    return res.json()
  }).catch(err => {
    console.error(err)
  })
}
