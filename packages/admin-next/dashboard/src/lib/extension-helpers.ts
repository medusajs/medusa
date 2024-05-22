import { RouteObject } from "react-router-dom"

/**
 * Used to test if a route is a settings route.
 */
export const settingsRouteRegex = /^\/settings\//

export const createRouteMap = (
  routes: { path: string; file: string }[],
  ignore?: string
): RouteObject[] => {
  const root: RouteObject[] = []

  const addRoute = (
    pathSegments: string[],
    file: string,
    currentLevel: RouteObject[]
  ) => {
    if (pathSegments.length === 0) {
      return
    }

    const [currentSegment, ...remainingSegments] = pathSegments
    let route = currentLevel.find((r) => r.path === currentSegment)

    if (!route) {
      route = { path: currentSegment, children: [] }
      currentLevel.push(route)
    }

    if (remainingSegments.length === 0) {
      route.children = route.children || []
      route.children.push({
        path: "",
        async lazy() {
          const { default: Component } = await import(/* @vite-ignore */ file)
          return { Component }
        },
      })
    } else {
      route.children = route.children || []
      addRoute(remainingSegments, file, route.children)
    }
  }

  routes.forEach(({ path, file }) => {
    // Remove the ignore segment from the path if it is provided
    const cleanedPath = ignore
      ? path.replace(ignore, "").replace(/^\/+/, "")
      : path.replace(/^\/+/, "")
    const pathSegments = cleanedPath.split("/").filter(Boolean)
    addRoute(pathSegments, file, root)
  })

  return root
}
