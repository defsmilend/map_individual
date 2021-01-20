
import config from 'config'

export default function getVideoLink (path) {
  return config.api.videos.replace('{{path}}', path)
}
