
import config from 'config'

export default function getImageLink (id) {
  if (!id) {
    return '/assets/placeholder.png'
  }
  return config.api.images.replace('{{id}}', id)
}
