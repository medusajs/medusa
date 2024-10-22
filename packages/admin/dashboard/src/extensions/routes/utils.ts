import { ComponentType } from "react"
import { RouteObject } from "react-router-dom"
import { RouteExtension, RouteModule } from "../types"

/**
 * Used to test if a route is a settings route.
 */
const settingsRouteRegex = /^\/settings\//

export const getRouteExtensions = (
  module: RouteModule,
  type: "settings" | "core"
) => {
  return module.routes.filter((route) => {
    if (type === "settings") {
      return settingsRouteRegex.test(route.path)
    }

    return !settingsRouteRegex.test(route.path)
  })
}

export const createRouteMap = (
  routes: RouteExtension[],
  ignore?: string
): RouteObject[] => {
  const root: RouteObject[] = []

  const addRoute = (
    fullPath: string,
    Component: ComponentType,
    currentLevel: RouteObject[]
  ) => {
    const pathSegments = fullPath.split("/").filter(Boolean)
    let currentArray = currentLevel

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i]
      let route = currentArray.find((r) => r.path === segment)

      if (!route) {
        route = {
          path: segment,
          lazy: async () => ({ Component }),
        }
        currentArray.push(route)
      }

      if (i < pathSegments.length - 1) {
        // This is not the last segment, so we need to move to the next level
        if (!route.children) {
          route.children = []
        }
        currentArray = route.children
      }
    }
  }

  routes.forEach(({ path, Component }) => {
    // Remove the ignore segment from the path if it is provided
    const cleanedPath = ignore
      ? path.replace(ignore, "").replace(/^\/+/, "")
      : path.replace(/^\/+/, "")
    addRoute(cleanedPath, Component, root)
  })

  return root
}
