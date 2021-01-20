export default function searchActive (builder) {
  return builder.query('term', 'active', 'true')
}
