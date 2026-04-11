import { dynamicImport, isFileSkipped, readDirRecursive } from "@medusajs/utils"
import { join, parse, sep } from "path"
import { logger } from "../logger"
import { HTTP_METHODS, type RouteDescriptor, type RouteVerb } from "./types"

/**
 * File name that is used to indicate that the file is a route file
 */
const ROUTE_NAME = "route"

/**
 * Flag that developers can export from their route files to indicate
 * whether or not the routes from this file should be authenticated.
 */
const AUTHTHENTICATION_FLAG = "AUTHENTICATE"

/**
 * Flag that developers can export from their route files to indicate
 * whether or not the routes from this file should implement CORS
 * policy.
 */
const CORS_FLAG = "CORS"

/**
 * The matcher to use to convert the dynamic params from the filesystem
 * identifier to the express identifier.
 *
 * We capture all words under opening and closing brackets `[]` and mark
 * it as a param via `:`.
 */
const PARAM_SEGMENT_MATCHER = /\[(\w+)\]/

/**
 * Regexes to use to identify if a route is prefixed
 * with "/admin", "/store", or "/auth".
 */
const ADMIN_ROUTE_MATCH = /(\/admin$|\/admin\/)/
const STORE_ROUTE_MATCH = /(\/store$|\/store\/)/
const AUTH_ROUTE_MATCH = /(\/auth$|\/auth\/)/

/**
 * Exposes to API to register routes manually or by scanning the filesystem from a
 * source directory.
 *
 * In case of duplicates routes, the route registered afterwards will override the
 * one registered first.
 */
export class RoutesLoader {
  /**
   * Routes collected manually or by scanning directories
   */
  #routes: Record<string, Record<string, RouteDescriptor>> = {}

  /**
   * Creates the route path from its relative file path.
   */
  createRoutePath(relativePath: string): string {
    const segments = relativePath.replace(/route(\.js|\.ts)$/, "").split(sep)
    const params: Record<string, boolean> = {}

    return `/${segments
      .filter((segment) => !!segment)
      .map((segment) => {
        if (segment.startsWith("[")) {
          segment = segment.replace(PARAM_SEGMENT_MATCHER, (_, group) => {
            if (params[group]) {
              logger.debug(
                `Duplicate parameters found in route ${relativePath} (${group})`
              )

              throw new Error(
                `Duplicate parameters found in route ${relativePath} (${group}). Make sure that all parameters are unique.`
              )
            }

            params[group] = true
            return `:${group}`
          })
        }
        return segment
      })
      .join("/")}`
  }

  /**
   * Returns the route config by exporting the route file and parsing
   * its exports
   */
  async #getRoutesForFile(
    routePath: string,
    absolutePath: string
  ): Promise<RouteDescriptor[]> {
    const routeExports = await dynamicImport(absolutePath)

    if (isFileSkipped(routeExports)) {
      return []
    }

    /**
     * Find the route type based upon its prefix.
     */
    const routeType = ADMIN_ROUTE_MATCH.test(routePath)
      ? "admin"
      : STORE_ROUTE_MATCH.test(routePath)
      ? "store"
      : AUTH_ROUTE_MATCH.test(routePath)
      ? "auth"
      : undefined

    /**
     * Check if the route file has decided to opt-out of authentication
     */
    const shouldAuthenticate =
      AUTHTHENTICATION_FLAG in routeExports
        ? !!routeExports[AUTHTHENTICATION_FLAG]
        : true

    /**
     * Check if the route file has decided to opt-out of CORS
     */
    const shouldApplyCors =
      CORS_FLAG in routeExports ? !!routeExports[CORS_FLAG] : true

    /**
     * Loop over all the exports and collect functions that are exported
     * with names after HTTP methods.
     */
    return Object.keys(routeExports)
      .filter((key) => {
        if (typeof routeExports[key] !== "function") {
          return false
        }

        if (!HTTP_METHODS.includes(key as RouteVerb)) {
          logger.debug(
            `Skipping handler ${key} in ${absolutePath}. Invalid HTTP method: ${key}.`
          )
          return false
        }

        return true
      })
      .map((key) => {
        return {
          isRoute: true,
          matcher: routePath,
          method: key as RouteVerb,
          handler: routeExports[key],
          optedOutOfAuth: !shouldAuthenticate,
          shouldAppendAdminCors: shouldApplyCors && routeType === "admin",
          shouldAppendAuthCors: shouldApplyCors && routeType === "auth",
          shouldAppendStoreCors: shouldApplyCors && routeType === "store",
        } satisfies RouteDescriptor
      })
  }

  /**
   * Scans a given directory and loads all routes from it. You can access the loaded
   * routes via "getRoutes" method
   */
  async scanDir(sourceDir: string) {
    const entries = await readDirRecursive(sourceDir, {
      ignoreMissing: true,
    })

    await Promise.all(
      entries
        .filter((entry) => {
          if (entry.isDirectory()) {
            return false
          }

          const { name, ext } = parse(entry.name)
          if (name === ROUTE_NAME && [".js", ".ts"].includes(ext)) {
            const routeFilePathSegment = join(entry.path, entry.name)
              .replace(sourceDir, "")
              .split(sep)

            return !routeFilePathSegment.some((segment) =>
              segment.startsWith("_")
            )
          }

          return false
        })
        .map(async (entry) => {
          const absolutePath = join(entry.path, entry.name)
          const relativePath = absolutePath.replace(sourceDir, "")
          const route = this.createRoutePath(relativePath)
          const routes = await this.#getRoutesForFile(route, absolutePath)

          routes.forEach((routeConfig) => {
            this.registerRoute({
              absolutePath,
              relativePath,
              ...routeConfig,
            })
          })
        })
    )
  }

  /**
   * Register a route
   */
  registerRoute(route: RouteDescriptor) {
    this.#routes[route.matcher] = this.#routes[route.matcher] ?? {}
    const trackedRoute = this.#routes[route.matcher]
    trackedRoute[route.method] = route
  }

  /**
   * Register one or more routes
   */
  registerRoutes(routes: RouteDescriptor[]) {
    routes.forEach((route) => this.registerRoute(route))
  }

  /**
   * Returns an array of routes scanned by the routes loader or registered
   * manually.
   */
  getRoutes() {
    return Object.keys(this.#routes).reduce<RouteDescriptor[]>(
      (result, routePattern) => {
        const methodsRoutes = this.#routes[routePattern]
        Object.keys(methodsRoutes).forEach((method) => {
          const route = methodsRoutes[method]
          result.push(route)
        })
        return result
      },
      []
    )
  }

  /**
   * Reload a single route file
   * This is used by HMR to reload routes when files change
   */
  async reloadRouteFile(
    absolutePath: string,
    sourceDir: string
  ): Promise<RouteDescriptor[]> {
    const relativePath = absolutePath.replace(sourceDir, "")
    const route = this.createRoutePath(relativePath)
    const routes = await this.#getRoutesForFile(route, absolutePath)

    // Register the new routes (will overwrite existing)
    routes.forEach((routeConfig) => {
      this.registerRoute({
        absolutePath,
        relativePath,
        ...routeConfig,
      })
    })

    return routes.map((routeConfig) => ({
      absolutePath,
      relativePath,
      ...routeConfig,
    }))
  }
}
