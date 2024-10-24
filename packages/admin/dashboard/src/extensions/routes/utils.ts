import { ComponentType } from "react"
import { RouteObject } from "react-router-dom"
import { ErrorBoundary } from "../../components/utilities/error-boundary"
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
    pathSegments: string[],
    Component: ComponentType,
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
        ErrorBoundary: ErrorBoundary,
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
    const cleanedPath = ignore
      ? path.replace(ignore, "").replace(/^\/+/, "")
      : path.replace(/^\/+/, "")
    const pathSegments = cleanedPath.split("/").filter(Boolean)
    addRoute(pathSegments, Component, root)
  })

  return root
}
