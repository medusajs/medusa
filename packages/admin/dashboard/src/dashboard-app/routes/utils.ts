import { ComponentType } from "react"
import { LoaderFunction, RouteObject } from "react-router-dom"
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

/**
 * Creates a route object for a branch node in the route tree
 * @param segment - The path segment for this branch
 */
const createBranchRoute = (segment: string): RouteObject => ({
  path: segment,
  children: [],
})

/**
 * Creates a route object for a leaf node with its component
 * @param Component - The React component to render at this route
 */
const createLeafRoute = (
  Component: ComponentType,
  loader?: LoaderFunction,
  handle?: object,
  path: string = ""
): RouteObject => ({
  path,
  ErrorBoundary: ErrorBoundary,
  async lazy() {
    const result: {
      Component: ComponentType
      loader?: LoaderFunction
      handle?: object
    } = { Component }

    if (loader) {
      result.loader = loader
    }

    if (handle) {
      result.handle = handle
    }

    return result
  },
})

/**
 * Creates a parallel route configuration
 * @param path - The route path
 * @param Component - The React component to render
 */
const createParallelRoute = (
  path: string,
  Component: ComponentType,
  loader?: LoaderFunction,
  handle?: object
) => ({
  path,
  async lazy() {
    const result: {
      Component: ComponentType
      loader?: LoaderFunction
      handle?: object
    } = { Component }

    if (loader) {
      result.loader = loader
    }

    if (handle) {
      result.handle = handle
    }

    return result
  },
})

/**
 * Processes parallel routes by cleaning their paths relative to the current path
 * @param parallelRoutes - Array of parallel route extensions
 * @param currentFullPath - The full path of the current route
 */
const processParallelRoutes = (
  parallelRoutes: RouteExtension[] | undefined,
  currentFullPath: string
): RouteObject[] | undefined => {
  return parallelRoutes
    ?.map(({ path, Component, loader, handle }) => {
      const childPath = path?.replace(currentFullPath, "").replace(/^\/+/, "")
      if (!childPath) {
        return null
      }
      return createParallelRoute(childPath, Component, loader, handle)
    })
    .filter(Boolean) as RouteObject[]
}

/**
 * Recursively builds the route tree by adding routes at the correct level
 * @param pathSegments - Array of remaining path segments to process
 * @param Component - The React component for the route
 * @param currentLevel - Current level in the route tree
 * @param parallelRoutes - Optional parallel routes to add
 * @param fullPath - The full path up to the current level
 */
const addRoute = (
  pathSegments: string[],
  Component: ComponentType,
  currentLevel: RouteObject[],
  loader?: LoaderFunction,
  handle?: object,
  parallelRoutes?: RouteExtension[],
  fullPath?: string,
  componentPath?: string
) => {
  if (!pathSegments.length) {
    return
  }

  const [currentSegment, ...remainingSegments] = pathSegments
  let route = currentLevel.find((r) => r.path === currentSegment)

  if (!route) {
    route = createBranchRoute(currentSegment)
    currentLevel.push(route)
  }

  const currentFullPath = fullPath
    ? `${fullPath}/${currentSegment}`
    : currentSegment

  const isComponentSegment = currentFullPath === componentPath

  if (isComponentSegment || remainingSegments.length === 0) {
    route.children ||= []

    if (handle) {
      route.handle = handle
    }

    if (loader) {
      route.loader = loader
    }

    // Since splat segments must occur at the end of a route, react-router enforces the segment to be a leaf.
    // Therefore we can't create a child leaf route with `path: ""` and must instead modify the route itself
    if (currentSegment === "*?" || currentSegment === "*") {
      const leaf = createLeafRoute(Component, loader, handle, currentSegment)
      leaf.children = processParallelRoutes(parallelRoutes, currentFullPath)
      Object.assign(route, leaf)
    } else {
      const leaf = createLeafRoute(Component, loader)
      leaf.children = processParallelRoutes(parallelRoutes, currentFullPath)
      route.children.push(leaf)
    }
    if (remainingSegments.length > 0) {
      addRoute(
        remainingSegments,
        Component,
        route.children,
        undefined,
        undefined,
        undefined,
        currentFullPath
      )
    }
  } else {
    route.children ||= []
    addRoute(
      remainingSegments,
      Component,
      route.children,
      loader,
      handle,
      parallelRoutes,
      currentFullPath,
      componentPath
    )
  }
}

/**
 * Creates a complete route map from route extensions
 * @param routes - Array of route extensions to process
 * @param ignore - Optional path prefix to ignore when processing routes
 * @returns An array of route objects forming a route tree
 */
export const createRouteMap = (
  routes: RouteExtension[],
  ignore?: string
): RouteObject[] => {
  const root: RouteObject[] = []

  routes.forEach(({ path, Component, loader, handle, children }) => {
    const cleanedPath = ignore
      ? path.replace(ignore, "").replace(/^\/+/, "")
      : path.replace(/^\/+/, "")
    const pathSegments = cleanedPath.split("/").filter(Boolean)
    addRoute(
      pathSegments,
      Component,
      root,
      loader,
      handle,
      children,
      undefined,
      path
    )
  })

  return root
}
