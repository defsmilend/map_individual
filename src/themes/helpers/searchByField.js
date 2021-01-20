export default function searchByField (builder, searchText = '') {
  return builder.andQuery('bool', b => b
    .orQuery('match_phrase', 'name', { query: searchText, boost: 6, analyzer: 'latin' })
    .orQuery('match_phrase', 'name', { query: searchText, boost: 6, analyzer: 'cyrillic' })
    .orQuery('match_phrase', 'name', { query: searchText, boost: 6, analyzer: 'cybernetic_ultra_analyzer' })
    .orQuery('query_string', { fields: ['ngram_name'], query: `*${searchText}*`, 'analyze_wildcard': true, boost: 4, analyzer: 'latin' })
    .orQuery('query_string', { fields: ['ngram_name'], query: `*${searchText}*`, 'analyze_wildcard': true, boost: 4, analyzer: 'cyrillic' })
    .orQuery('query_string', { fields: ['ngram_name'], query: `*${searchText}*`, 'analyze_wildcard': true, boost: 4, analyzer: 'cybernetic_ultra_analyzer' })
    .orQuery('match', 'ngram_name', { query: searchText, boost: 2, fuzziness: 2, analyzer: 'latin' })
    .orQuery('match', 'ngram_name', { query: searchText, boost: 2, fuzziness: 2, analyzer: 'cyrillic' })
    .orQuery('match', 'ngram_name', { query: searchText, boost: 2, fuzziness: 2, analyzer: 'cybernetic_ultra_analyzer' })
  )
}
