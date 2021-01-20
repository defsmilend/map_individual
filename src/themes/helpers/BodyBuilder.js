
const includesSpecialCharacters = (searchText) => {
  return /[!"^:]/g.test(searchText)
}

export default function BodyBuilder (builder, rootState) {
  return Object.assign({}, builder, {
    queryBySearchText (searchText, activeQueryBySearchText = true) {
      if (searchText && activeQueryBySearchText) {
        builder = builder.orQuery('match_phrase', 'name', { query: searchText, boost: 6, analyzer: 'latin' })
        builder = builder.orQuery('match_phrase', 'company.tags', { query: searchText, boost: 1, analyzer: 'latin' })
        builder = builder.orQuery('match_phrase', 'name', { query: searchText, boost: 6, analyzer: 'cyrillic' })
        builder = builder.orQuery('match_phrase', 'company.tags', { query: searchText, boost: 1, analyzer: 'cyrillic' })
        builder = builder.orQuery('match_phrase', 'name', { query: searchText, boost: 6, analyzer: 'cybernetic_ultra_analyzer' })
        builder = builder.orQuery('match', 'ngram_name', { query: searchText, boost: 2, fuzziness: 'auto', analyzer: 'latin' })
        builder = builder.orQuery('match', 'company.ngram_tags', { query: searchText, boost: 1, fuzziness: '0', fuzzy_transpositions: false, analyzer: 'latin' })
        builder = builder.orQuery('match', 'ngram_name', { query: searchText, boost: 2, fuzziness: 'auto', analyzer: 'cyrillic' })
        builder = builder.orQuery('match', 'company.ngram_tags', { query: searchText, boost: 1, fuzziness: '0', fuzzy_transpositions: false, analyzer: 'cyrillic' })
        builder = builder.orQuery('match', 'ngram_name', { query: searchText, boost: 2, fuzziness: 'auto', analyzer: 'cybernetic_ultra_analyzer' })
        builder = builder.orQuery('match', 'name', { query: searchText, boost: 2, fuzziness: 2, analyzer: 'latin' })
        builder = builder.orQuery('match', 'company.tags', { query: searchText, boost: 1, fuzziness: 1, analyzer: 'latin' })
        builder = builder.orQuery('match', 'name', { query: searchText, boost: 2, fuzziness: 2, analyzer: 'cyrillic' })
        builder = builder.orQuery('match', 'company.tags', { query: searchText, boost: 1, fuzziness: 1, analyzer: 'cyrillic' })
        builder = builder.orQuery('match', 'name', { query: searchText, boost: 2, fuzziness: 2, analyzer: 'cybernetic_ultra_analyzer' })
        if (!includesSpecialCharacters(searchText)) {
          builder = builder.orQuery('query_string', { fields: ['ngram_name'], query: `*${searchText}*`, 'analyze_wildcard': true, boost: 4, analyzer: 'latin' })
          builder = builder.orQuery('query_string', { fields: ['ngram_name'], query: `*${searchText}*`, 'analyze_wildcard': true, boost: 4, analyzer: 'cyrillic' })
          builder = builder.orQuery('query_string', { fields: ['ngram_name'], query: `*${searchText}*`, 'analyze_wildcard': true, boost: 4, analyzer: 'cybernetic_ultra_analyzer' })
        }
      }
      return this
    },

    queryByFirstLetter (searchText, activeQueryByFirstLetter = false) {
      if (searchText && activeQueryByFirstLetter) {
        builder = builder.query('query_string', {
          'fields': ['name'],
          'query': `${searchText}*`
        })
      }
      return this
    },

    queryByCategoryIds (categoryIds) {
      if (categoryIds && categoryIds.length) {
        builder.query('terms', 'categories.id', categoryIds)
          .andQuery('term', 'active', true)
          .sort('search_count', 'desc')
      }
      return this
    },

    queryByCategoryExternalIds (categoryExternalIds) {
      if (categoryExternalIds && categoryExternalIds.length) {
        builder.query('terms', 'categories.kt_external_id', categoryExternalIds)
          .andQuery('term', 'active', true)
      }
      return this
    },

    queryByTypeIds (typeIds) {
      if (typeIds && typeIds.length) {
        builder.query('terms', 'type_id', typeIds)
      }
      return this
    },

    queryByAllSelectedFilters (allSelectedFilters) {
      if (allSelectedFilters && Object.keys(allSelectedFilters).length) {
        for (let key in allSelectedFilters) {
          const filters = allSelectedFilters[key]
          if (filters.length) {
            if (key === 'offers') {
              let keyFilter = rootState.config.offers.filter(offer => filters.some(id => Number(id) === Number(offer.id)))
              keyFilter.forEach(filter => {
                builder = builder.filter('term', filter.key, true)
              })
            } else {
              builder = builder.orFilter('terms', key, filters)
            }
          }
        }
      }
      return this
    },

    queryByTopHitsAggregations (aggregations) {
      if (aggregations && aggregations.length) {
        aggregations.forEach(agg => {
          let aggParams = {
            size: rootState.config.esReqParams.maxSize
          }
          if (agg.sort) {
            aggParams.order = {'_term': agg.sort}
          }
          builder = builder.agg(agg.type, agg.field, aggParams)
        })
      }
      return this
    },

    queryTermsByIds (ids) {
      if (ids && ids.length) {
        builder.query('terms', 'id', ids)
      }
      return this
    },

    queryTermByActiveField (fieldFilter) {
      if (fieldFilter) {
        builder.query('term', fieldFilter, true)
      }
      return this
    }
  })
}
