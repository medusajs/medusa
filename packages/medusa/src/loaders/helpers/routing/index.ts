import { Express } from "express"
import { readdir } from "fs/promises"
import { extname, join } from "path"
import logger from "../../logger"
import {
  Config,
  GlobalMiddlewareConfig,
  GlobalMiddlewareDescriptor,
  GlobalMiddlewareRouteConfig,
  OnRouteLoadingHook,
  RouteConfig,
  RouteDescriptor,
  RouteVerbs,
} from "./types"

const log = ({
  activityId,
  message,
}: {
  activityId?: string
  message: string
}) => {
  if (activityId) {
    logger.progress(activityId, message)
    return
  }

  logger.info(message)
}

/**
 * File name that is used to indicate that the file is a route file
 */
const ROUTE_NAME = "route.js"

/**
 * File name for the global middlewares file
 */
const MIDDLEWARES_NAME = "middlewares.js"

/**
 * List of all the supported HTTP methods
 */
const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
]

const pathSegmentReplacer = {
  "\\[\\.\\.\\.\\]": () => `*`,
  "\\[(\\w+)?": (param?: string) => `:${param}`,
  "\\]": () => ``,
}

const specialMiddlewaresDirName = "_middlewares"

const createSpacingSting = (currentSize = 0) => {
  return new Array(4 - currentSize + 1).join(" ")
}

const isMiddlewaresDir = (path: string) =>
  path.includes(specialMiddlewaresDirName)

/**
 * @param {RouteDescriptor[] | GlobalMiddlewareDescriptor[]} routes
 *
 * @return {RouteDescriptor[] | GlobalMiddlewareDescriptor[]} An array of sorted
 * routes based on their priority
 */
const prioritize = (
  routes: RouteDescriptor[] | GlobalMiddlewareDescriptor[]
): RouteDescriptor[] | GlobalMiddlewareDescriptor[] => {
  return routes.sort((a, b) => {
    return a.priority - b.priority
  })
}

/**
 * The smaller the number the higher the priority with zero indicating
 * highest priority
 *
 * @param {string} url
 *
 * @return {number} An integer ranging from 0 to Infinity
 */
function calculatePriority(url: string): number {
  const depth = url.match(/\/.+?/g)?.length || 0
  const specifity = url.match(/\/:.+?/g)?.length || 0
  const catchall = (url.match(/\/\*/g)?.length || 0) > 0 ? Infinity : 0

  return depth + specifity + catchall
}

export class RoutesLoader<TConfig = Record<string, unknown>> {
  protected routesMap = new Map<string, RouteDescriptor>()
  protected globalMiddlewaresDescriptor: GlobalMiddlewareDescriptor | undefined

  protected app: Express
  protected activityId?: string
  protected onRouteLoading?: OnRouteLoadingHook<TConfig>
  protected rootDir: string
  protected excludes: RegExp[] = [/\.DS_Store/, /(\.ts\.map|\.js\.map|\.d\.ts)/]
  protected strict = false

  constructor({
    app,
    activityId,
    onRouteLoading,
    rootDir,
    excludes = [],
    strict = false,
  }: {
    app: Express
    activityId?: string
    onRouteLoading?: OnRouteLoadingHook<TConfig>
    rootDir: string
    excludes?: RegExp[]
    strict?: boolean
  }) {
    this.app = app
    this.activityId = activityId
    this.onRouteLoading = onRouteLoading
    this.rootDir = rootDir
    this.excludes.push(...(excludes ?? []))
    this.strict = strict
  }

  /**
   * Validate the route config and display a log info if
   * it should be ignored or skipped.
   *
   * @param {RouteDescriptor} descriptor
   * @param {Config} config
   * config is found
   *
   * @return {void}
   */
  protected validateRouteConfig({
    descriptor,
    config,
  }: {
    descriptor: RouteDescriptor
    config?: Config
  }): void {
    if (!config) {
      if (this.strict) {
        throw new Error(
          `Unable to load the routes from ` +
            `${descriptor.relativePath}. ` +
            `No config found.`
        )
      } else {
        log({
          activityId: this.activityId,
          message:
            `Skip loading handlers from ` +
            `${descriptor.relativePath}. ` +
            `No config found.`,
        })
      }
    }

    if (config?.ignore) {
      log({
        activityId: this.activityId,
        message:
          `Skip loading handlers from ` +
          `${descriptor.relativePath}. ` +
          `Ignore flag set to true.`,
      })
    }
  }

  /**
   * Validate the route config and display a log info if
   * it should be ignored or skipped.
   *
   * @param {GlobalMiddlewareDescriptor} descriptor
   * @param {GlobalMiddlewareConfig} config
   *
   * @return {void}
   */
  protected validateMiddlewaresConfig({
    config,
  }: {
    config?: GlobalMiddlewareConfig
  }): void {
    if (!config?.routes) {
      log({
        activityId: this.activityId,
        message: `No middlewares found. Skipping.`,
      })

      return
    }

    for (const route of config.routes) {
      if (!route.matcher) {
        throw new Error(
          `A route is missing a \`matcher\`. The field is required when applying middlewares.`
        )
      }
    }
  }

  /**
   * Take care of replacing the special path segments
   * to an express specific path segment
   *
   * @param route - The route to parse
   *
   * @example
   * "/admin/orders/[id]/index.ts" => "/admin/orders/:id/index.ts"
   */
  protected parseRoute(route: string): string {
    let route_ = route

    for (const config of Object.entries(pathSegmentReplacer)) {
      const [searchFor, replacedByFn] = config
      const replacer = new RegExp(searchFor, "g")

      const matches = [...route_.matchAll(replacer)]

      const parameters = new Set()

      for (const match of matches) {
        if (match?.[1] && !Number.isInteger(match?.[1])) {
          if (parameters.has(match?.[1])) {
            throw new Error(
              `Duplicate parameters found in route ${route} (${match?.[1]})`
            )
          }

          parameters.add(match?.[1])
        }

        route_ = route_.replace(match[0], replacedByFn(match?.[1]))
      }

      const extension = extname(route_)
      if (extension) {
        route_ = route_.replace(extension, "")
      }
    }

    route = route_

    return route
  }

  protected async createRouteConfig(path: string) {
    return await import(path).then((imp) => {
      const config: {
        routes: RouteConfig[]
      } = {
        routes: [],
      }

      // Get function names from the file
      const handlers = Object.keys(imp).filter((key) => {
        return typeof imp[key] === "function"
      })

      // If the handler has a valid HTTP method name then add it to the config
      for (const handler of handlers) {
        if (HTTP_METHODS.includes(handler.toUpperCase())) {
          config.routes.push({
            method: handler.toUpperCase() as RouteVerbs,
            handler: imp[handler],
          })
        } else {
          log({
            activityId: this.activityId,
            message: `Skipping handler ${handler} in ${path}. Invalid HTTP method name.`,
          })
        }
      }

      return config
    })
  }

  /**
   * Load the file content from a descriptor and retrieve the verbs and handlers
   * to be assigned to the descriptor
   *
   * @return {Promise<void>}
   */
  protected async retrieveFilesConfig(): Promise<void> {
    await Promise.all(
      [...this.routesMap.values(), ...this.globalMiddlewaresMap.values()].map(
        async (descriptor: RouteDescriptor | GlobalMiddlewareDescriptor) => {
          const absolutePath = descriptor.absolutePath
          const isGlobalMiddleware = isMiddlewaresDir(descriptor.route)

          const config = await this.createRouteConfig(absolutePath)

          return await import(absolutePath).then((imp) => {
            const map = isGlobalMiddleware
              ? this.globalMiddlewaresMap
              : this.routesMap

            if (isGlobalMiddleware) {
              this.validateMiddlewareConfig({
                descriptor: descriptor as GlobalMiddlewareDescriptor,
                config: imp.config,
              })
            } else {
              this.validateRouteConfig({
                descriptor,
                config: imp.config,
              })
            }

            // Assign default verb to GET
            imp.config ??= config

            descriptor.config = imp.config
            map.set(absolutePath, descriptor)
          })
        }
      )
    )
  }

  protected createDescriptor({
    dirPath,
    childPath,
    parentPath,
    isMiddleware,
  }: {
    dirPath: string
    childPath: string
    parentPath?: string
    isMiddleware?: boolean
  }) {
    const descriptor: RouteDescriptor | GlobalMiddlewareDescriptor = {
      absolutePath: childPath,
      relativePath: "",
      route: "",
      priority: Infinity,
    }

    const map = isMiddleware ? this.globalMiddlewaresMap : this.routesMap
    map.set(childPath, descriptor)

    // Remove the parentPath from the childPath
    if (parentPath) {
      childPath = childPath.replace(parentPath, "")
    }

    log({
      activityId: this.activityId,
      message: `Found file ${childPath} (from ${dirPath.replace(
        process.cwd(),
        ""
      )})`,
    })

    // File path without the parent path
    descriptor.relativePath = childPath

    // The path on which the route will be registered on
    let routeToParse = childPath

    const pathSegments = childPath.split("/")
    const lastSegment = pathSegments[pathSegments.length - 1]

    if (lastSegment.startsWith("route")) {
      pathSegments.pop()
      routeToParse = pathSegments.join("/")
    }

    descriptor.route = this.parseRoute(routeToParse)
    descriptor.priority = calculatePriority(descriptor.route)
  }

  protected async createMiddlewareDescriptor({ dirPath }: { dirPath: string }) {
    const middlewaresPath = join(dirPath, MIDDLEWARES_NAME)

    try {
      await import(middlewaresPath).then((imp) => {
        const middlewaresConfig = imp.config as
          | GlobalMiddlewareConfig
          | undefined

        if (!middlewaresConfig) {
          log({
            activityId: this.activityId,
            message: `No config found in ${middlewaresPath}.`,
          })
          return
        }

        this.validateMiddlewaresConfig({
          config: middlewaresConfig,
        })

        this.globalMiddlewaresDescriptor = {
          config: middlewaresConfig,
        }
      })
    } catch (error) {
      log({
        activityId: this.activityId,
        message: `No middlewares detected in ${dirPath}`,
      })
      return
    }
  }

  protected async createRoutesMap({
    dirPath,
    parentPath,
  }: {
    dirPath: string
    parentPath?: string
  }): Promise<void> {
    await Promise.all(
      await readdir(dirPath, { withFileTypes: true }).then((entries) => {
        return entries
          .filter((entry) => {
            /**
             * We exclude all files starting with an underscore
             * as underscore is used to indicate that files are
             * to be ignored.
             */
            if (entry.name.startsWith("_")) {
              return false
            }

            const fullPath = join(dirPath, entry.name)

            if (
              this.excludes.length &&
              this.excludes.some((exclude) => exclude.test(fullPath))
            ) {
              return false
            }

            if (entry.isFile() && entry.name !== ROUTE_NAME) {
              return false
            }

            return true
          })
          .map(async (entry) => {
            const childPath = join(dirPath, entry.name)

            if (entry.isDirectory()) {
              return this.createRoutesMap({
                dirPath: childPath,
                parentPath: parentPath ?? dirPath,
              })
            }

            return this.createDescriptor({
              dirPath,
              childPath,
              parentPath,
            })
          })
          .flat(Infinity)
      })
    )
  }

  protected async registerRoutes(): Promise<void> {
    const prioritizedRoutes = prioritize([...this.routesMap.values()])

    for (const descriptor of prioritizedRoutes) {
      if (!descriptor.config?.routes?.length) {
        continue
      }

      await this.onRouteLoading?.(descriptor as RouteDescriptor<TConfig>)

      const routes = descriptor.config.routes! as RouteConfig[]

      for (const route of routes) {
        log({
          activityId: this.activityId,
          message: `Registering route [${route.method?.toUpperCase()}] - ${
            descriptor.route
          }`,
        })
        this.app[route.method!.toLowerCase()](descriptor.route, route.handler)
      }
    }
  }

  protected async registerMiddlewares(): Promise<void> {
    const prioritizedMiddlewares = prioritize([
      ...this.globalMiddlewaresMap.values(),
    ])

    for (const descriptor of prioritizedMiddlewares) {
      if (!descriptor.config?.routes?.length) {
        continue
      }

      const routes = descriptor.config
        .routes! as unknown as GlobalMiddlewareRouteConfig[]

      for (const route of routes) {
        log({
          activityId: this.activityId,
          message: `Registering middleware [${route.method?.toUpperCase()}${createSpacingSting(
            route.method?.length
          )}] - ${route.matcher}`,
        })

        this.app[route.method!.toLowerCase()](
          route.matcher,
          ...route.middlewares
        )
      }
    }
  }

  /**
   * will walk through the rootDir and load all files if they need
   * to be loaded
   */
  async load<TConfig = unknown>() {
    performance.mark("file-base-routing-start" + this.rootDir)

    await this.createMiddlewaresMap({ dirPath: this.rootDir })

    await this.createRoutesMap({ dirPath: this.rootDir })
    await this.retrieveFilesConfig()

    await this.registerMiddlewares()
    await this.registerRoutes()

    performance.mark("file-base-routing-end" + this.rootDir)
    const timeSpent = performance
      .measure(
        "file-base-routing-measure" + this.rootDir,
        "file-base-routing-start" + this.rootDir,
        "file-base-routing-end" + this.rootDir
      )
      ?.duration?.toFixed(2)

    log({
      activityId: this.activityId,
      message: `Routes loaded in ${timeSpent} ms`,
    })

    this.routesMap.clear()
    this.globalMiddlewaresMap.clear()
  }
}

export default RoutesLoader
export * from "./types"
