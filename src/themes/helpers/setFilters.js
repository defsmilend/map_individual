export default function setFilters (directoriesByFilters, directoriesAgg, directoriesTotal) {
  let directories = []
  if (directoriesByFilters && directoriesByFilters.length && directoriesAgg && directoriesAgg.length) {
    directoriesAgg.forEach(item => {
      if (Number(item.doc_count) < Number(directoriesTotal)) {
        let foundCategoy = directoriesByFilters.find(category => Number(category.id) === Number(item.key))
        if (foundCategoy) {
          directories.push({
            name: foundCategoy.name,
            id: foundCategoy.id
          })
        }
      }
    })
  }
  return directories
}
