export default function categoriesFilter (categories, rootState) {
  const filteredCategories = []

  categories.forEach(({ id, kt_external_id, name, mall_information, image_id }) => {
    let category = mall_information.find(info => String(info.mall_id) === String(rootState.config.activeMall.mallId))

    if (category) {
      filteredCategories.push({
        id,
        kt_external_id,
        name,
        image_id,
        count: category.objects_count || 0,
        category
      })
    }
  })
  return filteredCategories
}
