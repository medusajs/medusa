import cors from "cors"
import { Express, json, urlencoded } from "express"
import { readdir } from "fs/promises"
import { parseCorsOrigins } from "medusa-core-utils"
import { extname, join } from "path"
import {
  authenticate,
  authenticateCustomer,
  requireCustomerAuthentication,
} from "../../../api/middlewares"
import { ConfigModule } from "../../../types/global"
import logger from "../../logger"
import {
  GlobalMiddlewareDescriptor,
  HTTP_METHODS,
  MiddlewaresConfig,
  RouteConfig,
  RouteDescriptor,
  RouteVerb,
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
const ROUTE_NAME = "route"

/**
 * Flag that developers can export from their route files to indicate
 * whether or not the route should be authenticated or not.
 */
const AUTHTHENTICATE = "AUTHENTICATE"

/**
 * File name for the global middlewares file
 */
const MIDDLEWARES_NAME = "middlewares"

const pathSegmentReplacer = {
  "\\[\\.\\.\\.\\]": () => `*`,
  "\\[(\\w+)?": (param?: string) => `:${param}`,
  "\\]": () => ``,
}

/**
 * @param routes - The routes to prioritize
 *
 * @return An array of sorted
 * routes based on their priority
 */
const prioritize = (routes: RouteDescriptor[]): RouteDescriptor[] => {
  return routes.sort((a, b) => {
    return a.priority - b.priority
  })
}

/**
 * The smaller the number the higher the priority with zero indicating
 * highest priority
 *
 * @param path - The path to calculate the priority for
 *
 * @return An integer ranging from `0` to `Infinity`
 */
function calculatePriority(path: string): number {
  const depth = path.match(/\/.+?/g)?.length || 0
  const specifity = path.match(/\/:.+?/g)?.length || 0
  const catchall = (path.match(/\/\*/g)?.length || 0) > 0 ? Infinity : 0

  return depth + specifity + catchall
}

export class RoutesLoader {
  protected routesMap = new Map<string, RouteDescriptor>()
  protected globalMiddlewaresDescriptor: GlobalMiddlewareDescriptor | undefined

  protected app: Express
  protected activityId?: string
  protected rootDir: string
  protected configModule: ConfigModule
  protected excludes: RegExp[] = [
    /\.DS_Store/,
    /(\.ts\.map|\.js\.map|\.d\.ts)/,
    /^_/,
  ]

  constructor({
    app,
    activityId,
    rootDir,
    configModule,
    excludes = [],
  }: {
    app: Express
    activityId?: string
    rootDir: string
    configModule: ConfigModule
    excludes?: RegExp[]
  }) {
    this.app = app
    this.activityId = activityId
    this.rootDir = rootDir
    this.configModule = configModule
    this.excludes.push(...(excludes ?? []))
  }

  /**
   * Validate the route config and display a log info if
   * it should be ignored or skipped.
   *
   * @param {GlobalMiddlewareDescriptor} descriptor
   * @param {MiddlewaresConfig} config
   *
   * @return {void}
   */
  protected validateMiddlewaresConfig({
    config,
  }: {
    config?: MiddlewaresConfig
  }): void {
    if (!config?.routes) {
      log({
        activityId: this.activityId,
        message: `No middleware routes found. Skipping middleware application.`,
      })

      return
    }

    for (const route of config.routes) {
      if (!route.matcher) {
        throw new Error(
          `Route is missing a \`matcher\` field. The 'matcher' field is required when applying middleware to this route.`
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
            log({
              activityId: this.activityId,
              message: `Duplicate parameters found in route ${route} (${match?.[1]})`,
            })

            throw new Error(
              `Duplicate parameters found in route ${route} (${match?.[1]}). Make sure that all parameters are unique.`
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
  protected async createRoutesConfig(): Promise<void> {
    await Promise.all(
      [...this.routesMap.values()].map(async (descriptor: RouteDescriptor) => {
        const absolutePath = descriptor.absolutePath

        return await import(absolutePath).then((import_) => {
          const map = this.routesMap

          const config: RouteConfig = {
            routes: [],
            shouldRequireAdminAuth: false,
            shouldRequireCustomerAuth: false,
            shouldAppendCustomer: false,
          }

          /**
           * If the developer has not exported the authenticate flag
           * we default to true.
           */
          const shouldRequireAuth =
            import_[AUTHTHENTICATE] !== undefined
              ? (import_[AUTHTHENTICATE] as boolean)
              : true

          if (
            shouldRequireAuth &&
            absolutePath.includes(join("api", "admin"))
          ) {
            config.shouldRequireAdminAuth = shouldRequireAuth
          }

          if (
            shouldRequireAuth &&
            absolutePath.includes(join("api", "store", "me"))
          ) {
            config.shouldRequireCustomerAuth = shouldRequireAuth
          }

          if (absolutePath.includes(join("api", "store"))) {
            config.shouldAppendCustomer = true
          }

          const handlers = Object.keys(import_).filter((key) => {
            /**
             * Filter out any export that is not a function
             */
            return typeof import_[key] === "function"
          })

          for (const handler of handlers) {
            if (HTTP_METHODS.includes(handler as RouteVerb)) {
              config.routes?.push({
                method: handler as RouteVerb,
                handler: import_[handler],
              })
            } else {
              log({
                activityId: this.activityId,
                message: `Skipping handler ${handler} in ${absolutePath}. Invalid HTTP method: ${handler}.`,
              })
            }
          }

          if (!config.routes?.length) {
            log({
              activityId: this.activityId,
              message: `No valid route handlers detected in ${absolutePath}. Skipping route configuration.`,
            })

            map.delete(absolutePath)
            return
          }

          descriptor.config = config
          map.set(absolutePath, descriptor)
        })
      })
    )
  }

  protected createRoutesDescriptor({
    childPath,
    parentPath,
  }: {
    childPath: string
    parentPath?: string
  }) {
    const descriptor: RouteDescriptor = {
      absolutePath: childPath,
      relativePath: "",
      route: "",
      priority: Infinity,
    }

    if (parentPath) {
      childPath = childPath.replace(parentPath, "")
    }

    descriptor.relativePath = childPath

    let routeToParse = childPath

    const pathSegments = childPath.split("/")
    const lastSegment = pathSegments[pathSegments.length - 1]

    if (lastSegment.startsWith("route")) {
      pathSegments.pop()
      routeToParse = pathSegments.join("/")
    }

    descriptor.route = this.parseRoute(routeToParse)
    descriptor.priority = calculatePriority(descriptor.route)

    this.routesMap.set(childPath, descriptor)
  }

  protected async createMiddlewaresDescriptor({
    dirPath,
  }: {
    dirPath: string
  }) {
    const files = await readdir(dirPath)

    const middlewareFilePath = files
      .filter((path) => {
        if (
          this.excludes.length &&
          this.excludes.some((exclude) => exclude.test(path))
        ) {
          return false
        }

        return true
      })
      .find((file) => {
        return file.replace(/\.[^/.]+$/, "") === MIDDLEWARES_NAME
      })

    if (!middlewareFilePath) {
      log({
        activityId: this.activityId,
        message: `No middleware files found in ${dirPath}. Skipping middleware configuration.`,
      })
      return
    }

    const absolutePath = join(dirPath, middlewareFilePath)

    try {
      await import(absolutePath).then((import_) => {
        const middlewaresConfig = import_.config as
          | MiddlewaresConfig
          | undefined

        if (!middlewaresConfig) {
          log({
            activityId: this.activityId,
            message: `No middleware configuration found in ${absolutePath}. Skipping middleware configuration.`,
          })
          return
        }

        middlewaresConfig.routes = middlewaresConfig.routes?.map((route) => {
          return {
            ...route,
            method: route.method ?? "USE",
          }
        })

        const descriptor: GlobalMiddlewareDescriptor = {
          config: middlewaresConfig,
        }

        this.validateMiddlewaresConfig(descriptor)

        this.globalMiddlewaresDescriptor = descriptor
      })
    } catch (error) {
      log({
        activityId: this.activityId,
        message: `Failed to load middleware configuration in ${absolutePath}. Skipping middleware configuration.`,
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
            const fullPath = join(dirPath, entry.name)

            if (
              this.excludes.length &&
              this.excludes.some((exclude) => exclude.test(entry.name))
            ) {
              return false
            }

            // Get entry name without extension
            const name = entry.name.replace(/\.[^/.]+$/, "")

            if (entry.isFile() && name !== ROUTE_NAME) {
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

            return this.createRoutesDescriptor({
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

      const routes = descriptor.config.routes

      if (descriptor.config.shouldAppendCustomer) {
        this.app.use(descriptor.route, authenticateCustomer())
      }

      if (descriptor.config.shouldRequireAdminAuth) {
        this.app.use(descriptor.route, authenticate())
      }

      if (descriptor.config.shouldRequireCustomerAuth) {
        this.app.use(descriptor.route, requireCustomerAuthentication())
      }

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
    const descriptor = this.globalMiddlewaresDescriptor

    if (!descriptor) {
      return
    }

    if (!descriptor.config?.routes?.length) {
      return
    }

    const routes = descriptor.config.routes

    for (const route of routes) {
      if (Array.isArray(route.method)) {
        for (const method of route.method) {
          log({
            activityId: this.activityId,
            message: `Registering middleware [${method}] - ${route.matcher}`,
          })

          this.app[method.toLowerCase()](route.matcher, ...route.middlewares)
        }
      } else {
        log({
          activityId: this.activityId,
          message: `Registering middleware [${route.method}] - ${route.matcher}`,
        })

        this.app[route.method!.toLowerCase()](
          route.matcher,
          ...route.middlewares
        )
      }
    }
  }

  applyGlobalMiddlewares() {
    if (this.routesMap.size > 0) {
      this.app.use(json(), urlencoded({ extended: true }))

      const adminCors = this.configModule.projectConfig.admin_cors || ""
      this.app.use(
        "/admin",
        cors({
          origin: parseCorsOrigins(adminCors),
          credentials: true,
        })
      )

      const storeCors = this.configModule.projectConfig.store_cors || ""
      this.app.use(
        "/store",
        cors({ origin: parseCorsOrigins(storeCors), credentials: true })
      )
    }
  }

  async load() {
    performance.mark("file-base-routing-start" + this.rootDir)

    let apiExists = true

    /**
     * Since the file based routing does not require a index file
     * we can check if it exists using require. Instead we try
     * to read the directory and if it fails we know that the
     * directory does not exist.
     */
    try {
      await readdir(this.rootDir)
    } catch (_error) {
      apiExists = false
    }

    if (apiExists) {
      await this.createMiddlewaresDescriptor({ dirPath: this.rootDir })

      await this.createRoutesMap({ dirPath: this.rootDir })
      await this.createRoutesConfig()

      this.applyGlobalMiddlewares()

      await this.registerMiddlewares()
      await this.registerRoutes()
    }

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
    this.globalMiddlewaresDescriptor = undefined
  }
}

export default RoutesLoader
