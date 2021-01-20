export default function generateItemLink ({ item }) {
  if (item.is_to_page_shopping_light) return `service-shopping-light?mallObjectId=${item.id}`

  let name = ''
  let query = null
  let params = null

  const isMallOject = !!item.categories
  const isCategory = !!item.code
  const useGroupedBrands = !!item.map_use_grouped_brands
  let categoryForMap = null
  if (item && item.categories && Array.isArray(item.categories)) {
    categoryForMap = item.categories.find(category => {
      if (category.use_as_map) {
        return category
      }
    })
  }
  const itemName = item.name.trim().toLowerCase()
  name = 'search-by-types'
  query = { searchText: itemName }

  if (isMallOject && !categoryForMap) {
    name = 'mall-object-page'
    query = { mallObject: item.id }
  }
  if (isMallOject && categoryForMap) {
    name = 'search-services-object-by-group'
    params = { service: categoryForMap.code, object_id: item.id }
    query = {}
  }
  if (isCategory) {
    name = useGroupedBrands ? 'search-services-by-group' : 'search-services'
    params = { service: item.code }
    query = {}
  }

  return {
    name,
    query,
    params
  }
}
