
import config from 'config'

export default function proxyRequestEnqueue ({ url, params = {}, body = null, method = null }) {
  let defaultMethod = body ? 'POST' : 'GET'
  const options = {
    method: method || defaultMethod,
    mode: 'cors',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  // creating url to request from proxy
  if (!url.startsWith('http')) {
    url = url.startsWith('/') ? url : `/${url}`
    url = new URL(config.api.backendUrl + url)
  } else {
    url = new URL(url)
  }
  url.search = new URLSearchParams(params)
  params = { url }

  // creating url of proxy
  if (!config.microservice.enqueueProxy.startsWith('http')) {
    url = new URL(`${window.location.origin}${config.microservice.enqueueProxy}`)
  } else {
    url = new URL(config.microservice.enqueueProxy)
  }
  url.search = new URLSearchParams(params)

  // proceeding request
  return fetch(url, options).then(res => {
    return res.json()
  }).catch(err => {
    console.error(err)
  })
}
