
import config from 'config'

export default function getPlaceholder (type) {
  return config.placeholders[`${type}`] ? config.placeholders[`${type}`].placeholderImg : config.placeholders.default.placeholderImg
}
