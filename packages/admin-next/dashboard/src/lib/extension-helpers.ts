import { RouteObject } from "react-router-dom"

/**
 * Used to test if a route is a settings route.
 */
export const settingsRouteRegex = /^\/settings\//

export const createRouteMap = (
  routes: { path: string; Component: () => JSX.Element }[],
  ignore?: string
): RouteObject[] => {
  const root: RouteObject[] = []

  const addRoute = (
    pathSegments: string[],
    Component: () => JSX.Element,
    currentLevel: RouteObject[]
  ) => {
    if (!pathSegments.length) {
      return
    }

    const [currentSegment, ...remainingSegments] = pathSegments
    let route = currentLevel.find((r) => r.path === currentSegment)

    if (!route) {
      route = { path: currentSegment, children: [] }
      currentLevel.push(route)
    }

    if (remainingSegments.length === 0) {
      route.children ||= []
      route.children.push({
        path: "",
        async lazy() {
          return { Component }
        },
      })
    } else {
      route.children ||= []
      addRoute(remainingSegments, Component, route.children)
    }
  }

  routes.forEach(({ path, Component }) => {
    // Remove the ignore segment from the path if it is provided
    const cleanedPath = ignore
      ? path.replace(ignore, "").replace(/^\/+/, "")
      : path.replace(/^\/+/, "")
    const pathSegments = cleanedPath.split("/").filter(Boolean)
    addRoute(pathSegments, Component, root)
  })

  return root
}
