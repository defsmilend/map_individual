export default function jsonBase64Encoder (data) {
  const json = JSON.stringify(data)
  return btoa(json)
}
