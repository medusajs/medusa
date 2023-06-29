import { readdir } from "fs/promises"
import { extname, join } from "path"
import { Express } from "express"
import {
  Config,
  GlobalMiddlewareConfig,
  GlobalMiddlewareDescriptor,
  GlobalMiddlewareRouteConfig,
  OnRouteLoadingHook,
  RouteConfig,
  RouteDescriptor,
} from "./types"
import logger from "../../logger"

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
function calculatePriority(url: string) {
  const depth = url.match(/\/.+?/g)?.length || 0
  const specifity = url.match(/\/:.+?/g)?.length || 0
  const catchall = (url.match(/\/\*/g)?.length || 0) > 0 ? Infinity : 0

  return depth + specifity + catchall
}

export class RoutesLoader<TConfig = Record<string, unknown>> {
  protected routesMap = new Map<string, RouteDescriptor>()
  protected globalMiddlewaresMap = new Map<string, GlobalMiddlewareDescriptor>()

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
  protected validateMiddlewareConfig({
    descriptor,
    config,
  }: {
    descriptor: GlobalMiddlewareDescriptor
    config?: GlobalMiddlewareConfig
    strict?: boolean
  }): void {
    if (!config) {
      if (this.strict) {
        throw new Error(
          `Unable to load the middlewares from ` +
            `${descriptor.relativePath}. ` +
            `No config found.`
        )
      } else {
        log({
          activityId: this.activityId,
          message:
            `Skip loading middlewares from ` +
            `${descriptor.relativePath}. ` +
            `No config found.`,
        })
      }
    }

    if (config?.ignore) {
      log({
        activityId: this.activityId,
        message:
          `Skip loading middlewares from ` +
          `${descriptor.relativePath}. ` +
          `Ignore flag set to true.`,
      })
    }

    if (!config?.routes?.some((route) => route.path)) {
      throw new Error(
        `Unable to load the middlewares from ` +
          `${descriptor.relativePath}. ` +
          `Missing path config.`
      )
    }
  }

  /**
   * Take care of replacing the special path segments
   * to an express specific path segment
   *
   * @param {string} route
   * @return {string}
   *
   * @example
   * /admin/orders/[id]/index.ts => /admin/orders/:id/index.ts
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
              // eslint-disable-next-line max-len
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
            imp.config ??= {}
            imp.config.routes = imp.config?.routes?.map(
              (route: RouteConfig | GlobalMiddlewareRouteConfig) => {
                route.method = route.method ?? "get"
                return route
              }
            )

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
    isInMiddlewaresDirectory,
  }) {
    const descriptor: RouteDescriptor | GlobalMiddlewareDescriptor = {
      absolutePath: childPath,
      relativePath: "",
      route: "",
      priority: Infinity,
    }

    const map = isInMiddlewaresDirectory
      ? this.globalMiddlewaresMap
      : this.routesMap
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

    if (lastSegment.startsWith("index")) {
      pathSegments.pop()
      routeToParse = pathSegments.join("/")
    }

    descriptor.route = this.parseRoute(routeToParse)
    descriptor.priority = calculatePriority(descriptor.route)
  }

  protected async walkThrough({
    dirPath,
    parentPath,
    isInMiddlewaresDirectory,
  }: {
    dirPath: string
    parentPath?: string
    isInMiddlewaresDirectory?: boolean
  }): Promise<void> {
    await Promise.all(
      await readdir(dirPath, { withFileTypes: true }).then((entries) => {
        return entries
          .filter((entry) => {
            if (!this.excludes.length) {
              return true
            }

            const fullPath = join(dirPath, entry.name)
            return !this.excludes.some((exclude) => exclude.test(fullPath))
          })
          .map((entry) => {
            const childPath = join(dirPath, entry.name)
            isInMiddlewaresDirectory = isMiddlewaresDir(dirPath)

            if (entry.isDirectory()) {
              return this.walkThrough({
                dirPath: childPath,
                parentPath: parentPath ?? dirPath,
                isInMiddlewaresDirectory,
              })
            }

            return this.createDescriptor({
              dirPath,
              childPath,
              parentPath,
              isInMiddlewaresDirectory,
            })
          })
          .flat(Infinity)
      })
    )
  }

  /**
   * Register the routes to the express app
   *
   * @return {Promise<void>}
   */
  protected async registerRoutesAndMiddlewares() {
    const prioritizedMiddlewares = prioritize([
      ...this.globalMiddlewaresMap.values(),
    ])
    const prioritizedRoutes = prioritize([...this.routesMap.values()])

    const routesAndMiddlewares = [
      ...prioritizedMiddlewares,
      ...prioritizedRoutes,
    ] as RouteDescriptor[] | GlobalMiddlewareDescriptor[]

    for (const descriptor of routesAndMiddlewares) {
      if (!descriptor.config?.routes?.length || descriptor.config?.ignore) {
        continue
      }

      if (isMiddlewaresDir(descriptor.route)) {
        const routes = descriptor.config
          .routes! as unknown as GlobalMiddlewareRouteConfig[]

        for (const route of routes) {
          log({
            activityId: this.activityId,
            message: `Registering middleware [${route.method?.toUpperCase()}${createSpacingSting(
              route.method?.length
            )}] - ${route.path}`,
          })

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(this.app as any)[route.method!.toLowerCase()](
            route.path,
            ...route.middlewares
          )
        }

        continue
      }

      await this.onRouteLoading?.(descriptor as RouteDescriptor<TConfig>)

      const routes = descriptor.config.routes! as RouteConfig[]

      for (const route of routes) {
        log({
          activityId: this.activityId,
          message: `Registering route [${route.method?.toUpperCase()}${createSpacingSting(
            route.method?.length
          )}] - ${descriptor.route}`,
        })
        ;(this.app as any)[route.method!.toLowerCase()](
          descriptor.route,
          ...route.handlers
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

    await this.walkThrough({ dirPath: this.rootDir })
    await this.retrieveFilesConfig()
    await this.registerRoutesAndMiddlewares()

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
