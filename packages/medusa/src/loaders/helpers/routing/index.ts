import { ConfigModule } from "@medusajs/types"
import { promiseAll, wrapHandler } from "@medusajs/utils"
import cors from "cors"
import { Router, json, text, urlencoded, type Express } from "express"
import { readdir } from "fs/promises"
import { parseCorsOrigins } from "medusa-core-utils"
import { extname, join, sep } from "path"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import {
  authenticateCustomer,
  authenticateLegacy,
  errorHandler,
  requireCustomerAuthentication,
} from "../../../utils/middlewares"
import logger from "../../logger"
import {
  AsyncRouteHandler,
  GlobalMiddlewareDescriptor,
  HTTP_METHODS,
  MiddlewareRoute,
  MiddlewareVerb,
  MiddlewaresConfig,
  ParserConfigArgs,
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

function matchMethod(
  method: RouteVerb,
  configMethod: MiddlewareRoute["method"]
): boolean {
  if (!configMethod || configMethod === "USE" || configMethod === "ALL") {
    return true
  } else if (Array.isArray(configMethod)) {
    return (
      configMethod.includes(method) ||
      configMethod.includes("ALL") ||
      configMethod.includes("USE")
    )
  } else {
    return method === configMethod
  }
}

/**
 * Function that looks though the global middlewares and returns the first
 * complete match for the given path and method.
 *
 * @param path - The path to match
 * @param method - The method to match
 * @param routes - The routes to match against
 * @returns The first complete match or undefined if no match is found
 */
function findMatch(
  path: string,
  method: RouteVerb,
  routes: MiddlewareRoute[]
): MiddlewareRoute | undefined {
  for (const route of routes) {
    const { matcher, method: configMethod } = route

    if (matchMethod(method, configMethod)) {
      let isMatch = false

      if (typeof matcher === "string") {
        // Convert wildcard expressions to proper regex for matching entire path
        // The '.*' will match any character sequence including '/'
        const regex = new RegExp(`^${matcher.split("*").join(".*")}$`)
        isMatch = regex.test(path)
      } else if (matcher instanceof RegExp) {
        // Ensure that the regex matches the entire path
        const match = path.match(matcher)
        isMatch = match !== null && match[0] === path
      }

      if (isMatch) {
        return route // Return the first complete match
      }
    }
  }

  return undefined // Return undefined if no complete match is found
}

/**
 * Returns an array of body parser middlewares that are applied on routes
 * out-of-the-box.
 */
function getBodyParserMiddleware(args?: ParserConfigArgs) {
  const sizeLimit = args?.sizeLimit
  const preserveRawBody = args?.preserveRawBody
  return [
    json({
      limit: sizeLimit,
      verify: preserveRawBody
        ? (req: MedusaRequest, res: MedusaResponse, buf: Buffer) => {
            req.rawBody = buf
          }
        : undefined,
    }),
    text({ limit: sizeLimit }),
    urlencoded({ limit: sizeLimit, extended: true }),
  ]
}

export class RoutesLoader {
  protected routesMap = new Map<string, RouteDescriptor>()
  protected globalMiddlewaresDescriptor: GlobalMiddlewareDescriptor | undefined

  protected app: Express
  protected router: Router
  protected activityId?: string
  protected rootDir: string
  protected configModule: ConfigModule
  protected excludes: RegExp[] = [
    /\.DS_Store/,
    /(\.ts\.map|\.js\.map|\.d\.ts)/,
    /^_[^/\\]*(\.[^/\\]+)?$/,
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
    this.router = Router()
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
    if (!config?.routes && !config?.errorHandler) {
      log({
        activityId: this.activityId,
        message: `Empty middleware config. Skipping middleware application.`,
      })

      return
    }

    for (const route of config.routes ?? []) {
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
   * "/admin/orders/[id]/route.ts => "/admin/orders/:id/route.ts"
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
    await promiseAll(
      [...this.routesMap.values()].map(async (descriptor: RouteDescriptor) => {
        const absolutePath = descriptor.absolutePath
        const route = descriptor.route

        return await import(absolutePath).then((import_) => {
          const map = this.routesMap

          const config: RouteConfig = {
            routes: [],
            shouldRequireAdminAuth: false,
            shouldRequireCustomerAuth: false,
            shouldAppendCustomer: false,
            shouldAppendAuthCors: false,
          }

          /**
           * If the developer has not exported the
           * AUTHENTICATE flag we default to true.
           */
          const shouldRequireAuth =
            import_[AUTHTHENTICATE] !== undefined
              ? (import_[AUTHTHENTICATE] as boolean)
              : true

          /**
           * If the developer has not exported the
           * CORS flag we default to true.
           */
          const shouldAddCors =
            import_["CORS"] !== undefined ? (import_["CORS"] as boolean) : true

          if (route.startsWith("/admin")) {
            if (shouldAddCors) {
              config.shouldAppendAdminCors = true
            }

            if (shouldRequireAuth) {
              config.shouldRequireAdminAuth = true
            }
          }

          if (route.startsWith("/store")) {
            config.shouldAppendCustomer = true

            if (shouldAddCors) {
              config.shouldAppendStoreCors = true
            }
          }

          if (route.startsWith("/auth") && shouldAddCors) {
            config.shouldAppendAuthCors = true
          }

          if (shouldRequireAuth && route.startsWith("/store/me")) {
            config.shouldRequireCustomerAuth = shouldRequireAuth
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

    const pathSegments = childPath.split(sep)
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
    await promiseAll(
      await readdir(dirPath, { withFileTypes: true }).then((entries) => {
        return entries
          .filter((entry) => {
            if (
              this.excludes.length &&
              this.excludes.some((exclude) => exclude.test(entry.name))
            ) {
              return false
            }

            let name = entry.name

            const extension = extname(name)

            if (extension) {
              name = name.replace(extension, "")
            }

            if (entry.isFile() && name !== ROUTE_NAME) {
              return false
            }

            return true
          })
          .map(async (entry) => {
            const childPath = join(dirPath, entry.name)

            if (entry.isDirectory()) {
              return await this.createRoutesMap({
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

  /**
   * Apply the most specific body parser middleware to the router
   */
  applyBodyParserMiddleware(path: string, method: RouteVerb): void {
    const middlewareDescriptor = this.globalMiddlewaresDescriptor

    const mostSpecificConfig = findMatch(
      path,
      method,
      middlewareDescriptor?.config?.routes ?? []
    )

    if (!mostSpecificConfig || mostSpecificConfig?.bodyParser === undefined) {
      this.router[method.toLowerCase()](path, ...getBodyParserMiddleware())

      return
    }

    if (mostSpecificConfig?.bodyParser) {
      this.router[method.toLowerCase()](
        path,
        ...getBodyParserMiddleware(mostSpecificConfig?.bodyParser)
      )

      return
    }

    return
  }

  /**
   * Apply the route specific middlewares to the router,
   * this includes the cors, authentication and
   * body parsing. These are applied first to ensure
   * that they are applied before any other middleware.
   */
  applyRouteSpecificMiddlewares(): void {
    const prioritizedRoutes = prioritize([...this.routesMap.values()])

    for (const descriptor of prioritizedRoutes) {
      if (!descriptor.config?.routes?.length) {
        continue
      }

      const routes = descriptor.config.routes

      /**
       * Apply default store and admin middlewares if
       * not opted out of.
       */

      if (descriptor.config.shouldAppendAdminCors) {
        /**
         * Apply the admin cors
         */
        this.router.use(
          descriptor.route,
          cors({
            origin: parseCorsOrigins(
              this.configModule.projectConfig.http.adminCors
            ),
            credentials: true,
          })
        )
      }

      if (descriptor.config.shouldAppendAuthCors) {
        /**
         * Apply the auth cors
         */
        this.router.use(
          descriptor.route,
          cors({
            origin: parseCorsOrigins(
              this.configModule.projectConfig.http.authCors
            ),
            credentials: true,
          })
        )
      }

      if (descriptor.config.shouldAppendStoreCors) {
        /**
         * Apply the store cors
         */
        this.router.use(
          descriptor.route,
          cors({
            origin: parseCorsOrigins(
              this.configModule.projectConfig.http.storeCors
            ),
            credentials: true,
          })
        )
      }

      if (descriptor.config.shouldAppendCustomer) {
        /**
         * Add the customer to the request object
         */
        this.router.use(descriptor.route, authenticateCustomer())
      }

      if (descriptor.config.shouldRequireCustomerAuth) {
        /**
         * Require the customer to be authenticated
         */
        this.router.use(descriptor.route, requireCustomerAuthentication())
      }

      if (descriptor.config.shouldRequireAdminAuth) {
        /**
         * Require the admin to be authenticated
         */
        this.router.use(descriptor.route, authenticateLegacy())
      }

      for (const route of routes) {
        /**
         * Apply the body parser middleware if the route
         * has not opted out of it.
         */
        this.applyBodyParserMiddleware(descriptor.route, route.method!)
      }
    }
  }

  /**
   * Apply the error handler middleware to the router
   */
  applyErrorHandlerMiddleware(): void {
    const middlewareDescriptor = this.globalMiddlewaresDescriptor
    const errorHandlerFn = middlewareDescriptor?.config?.errorHandler

    /**
     * If the user has opted out of the error handler then return
     */
    if (errorHandlerFn === false) {
      return
    }

    /**
     * If the user has provided a custom error handler then use it
     */
    if (errorHandlerFn) {
      this.router.use(errorHandlerFn)
      return
    }

    /**
     * If the user has not provided a custom error handler then use the
     * default one.
     */
    this.router.use(errorHandler())
  }

  protected async registerRoutes(): Promise<void> {
    const middlewareDescriptor = this.globalMiddlewaresDescriptor

    const shouldWrapHandler = middlewareDescriptor?.config
      ? middlewareDescriptor.config.errorHandler !== false
      : true

    const prioritizedRoutes = prioritize([...this.routesMap.values()])

    for (const descriptor of prioritizedRoutes) {
      if (!descriptor.config?.routes?.length) {
        continue
      }

      const routes = descriptor.config.routes

      for (const route of routes) {
        log({
          activityId: this.activityId,
          message: `Registering route [${route.method?.toUpperCase()}] - ${
            descriptor.route
          }`,
        })

        /**
         * If the user hasn't opted out of error handling then
         * we wrap the handler in a try/catch block.
         */
        const handler = shouldWrapHandler
          ? wrapHandler(route.handler as AsyncRouteHandler)
          : route.handler

        this.router[route.method!.toLowerCase()](descriptor.route, handler)
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

    /**
     * We don't prioritize the middlewares to preserve the order
     * in which they are defined in the 'middlewares.ts'. This is to
     * maintain the same behavior as how middleware is applied
     * in Express.
     */

    for (const route of routes) {
      if (!route.middlewares || !route.middlewares.length) {
        continue
      }

      const methods = (
        Array.isArray(route.method) ? route.method : [route.method]
      ).filter(Boolean) as MiddlewareVerb[]

      for (const method of methods) {
        log({
          activityId: this.activityId,
          message: `Registering middleware [${method}] - ${route.matcher}`,
        })

        this.router[method.toLowerCase()](route.matcher, ...route.middlewares)
      }
    }
  }

  async load() {
    performance && performance.mark("file-base-routing-start" + this.rootDir)

    let apiExists = true

    /**
     * Since the file based routing does not require a index file
     * we can't check if it exists using require. Instead we try
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

      this.applyRouteSpecificMiddlewares()

      await this.registerMiddlewares()
      await this.registerRoutes()

      this.applyErrorHandlerMiddleware()

      /**
       * Apply the router to the app.
       *
       * This prevents middleware from a plugin from
       * bleeding into the global middleware stack.
       */
      this.app.use("/", this.router)
    }

    performance && performance.mark("file-base-routing-end" + this.rootDir)
    const timeSpent =
      performance &&
      performance
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
