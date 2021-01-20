
export default function generateMenuLink ({ item, idsCategory, types, categoriesFilters, submenuId }) {
  let name = ''
  let query = {}
  let params = {}
  const isCategories = item.categoriesList && item.categoriesList.length

  if (item.link) {
    return item.link
  } else if (item.mall_object) {
    name = 'mall-object-page'
    query = { mallObject: item.mall_object.id }
  } else if (isCategories === 1 && item.categoriesList[0].use_as_map) {
    name = 'search-services'
    params = { service: item.categoriesList[0].code }
  } else if (isCategories) {
    name = 'category-page'
    query = { categories: idsCategory || item.categoriesList.map(category => category.id).join(',') }
    if (types) {
      query.types = types
    }
    if (categoriesFilters) {
      query.categoriesFilters = categoriesFilters
    }
    if (submenuId) {
      query.submenuId = submenuId
    }
  }

  return {
    name,
    query,
    params
  }
}
