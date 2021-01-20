import config from 'config'
import store from '@vue-storefront/core/store'

export default function esRequest ({ params, body = null }) {
  if (!params.index) {
    const error = 'ElasticSearch request cannot be proceed without index name or alias'
    console.error(error)
    return new Promise((resolve, reject) => reject(error))
  }
  params.type = params.index
  params.index = `mall-${store.state.main.mall.id}`
  const options = {
    method: body ? 'POST' : 'GET',
    mode: 'cors',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  }

  if (body) {
    options.body = JSON.stringify(body)
  }
  const url = new URL(window.location.origin + config.api.esProxy)
  url.search = new URLSearchParams(Object.assign({}, { size: 1000 }, params))
  return fetch(url, options).then(res => {
    return res.json()
  }).catch(err => {
    console.error(err)
  })
}
