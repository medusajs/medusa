export const getAllRoutes = routes => {
  const allRoutes = []

  const traverse = (item, directory = "") => {
    if (item.items) {
      return item.items.forEach(nestedItem =>
        traverse(nestedItem, `${directory}/${item.id}`)
      )
    }

    allRoutes.push({ slug: `${directory}/${item.id}`, title: item.title })
  }

  routes.forEach(item => traverse(item))

  return allRoutes
}

export const getRouteContext = (navList, location) => {
  let ctx = { prev: null, next: null }
  if (!location) return ctx

  const allRoutes = getAllRoutes(navList)

  for (let i = 0; i < allRoutes.length; i++) {
    const route = allRoutes[i]

    if (location.pathname === route.slug) {
      ctx = {
        next: allRoutes[i + 1],
        prev: allRoutes[i - 1],
      }
    }
  }

  return ctx
}
