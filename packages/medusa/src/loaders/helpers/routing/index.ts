import { Express } from "express"
import { readdir } from "fs/promises"
import { extname, join } from "path"
import {
  Config,
  excludeExtensions,
  GlobalMiddlewareConfig,
  GlobalMiddlewareDescriptor,
  GlobalMiddlewareRouteConfig,
  OnRouteLoadingHook,
  RouteConfig,
  RouteDescriptor,
} from "./types"
import logger from "../../logger"

const pathSegmentReplacer = {
  "\\[\\.\\.\\.\\]": () => `*`,
  "\\[(\\w+)?": (param?: string) => `:${param}`,
  "\\]": () => ``,
}

const specialMiddlewaresDirName = "_middlewares"

const routesMap = new Map<string, RouteDescriptor>()
const globalMiddlewaresMap = new Map<string, GlobalMiddlewareDescriptor>()

const createSpacingSting = (currentSize = 0) => {
  return new Array(4 - currentSize + 1).join(" ")
}

const isMiddlewaresDir = (path: string) =>
  path.endsWith(specialMiddlewaresDirName)

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

/**
 * Validate the route config and display a log info if
 * it should be ignored or skipped.
 *
 * @param {RouteDescriptor} descriptor
 * @param {Config} config
 * @param {boolean?} strict If set to true, will throw an error if no
 * config is found
 *
 * @return {void}
 */
function validateRouteConfig(
  descriptor: RouteDescriptor,
  config?: Config,
  strict?: boolean
): void {
  if (!config) {
    if (strict) {
      throw new Error(
        `Unable to load the routes from ` +
          `${descriptor.relativePath}. ` +
          `No config found. Did you export a config object?`
      )
    } else {
      logger.info(
        `Skipping loading handlers from ` +
          `${descriptor.relativePath}. ` +
          `No config found. Did you export a config object?`
      )
    }
  }

  if (config?.ignore) {
    logger.info(
      `Skipping loading handlers from ` +
        `${descriptor.relativePath}. ` +
        `Ignore flag set to true.`
    )
  }
}

/**
 * Validate the route config and display a log info if
 * it should be ignored or skipped.
 *
 * @param {GlobalMiddlewareDescriptor} descriptor
 * @param {GlobalMiddlewareConfig} config
 * @param {boolean?} strict If set to true, will throw an error if no
 * config is found
 *
 * @return {void}
 */
function validateMiddlewareConfig(
  descriptor: GlobalMiddlewareDescriptor,
  config?: GlobalMiddlewareConfig,
  strict?: boolean
): void {
  if (!config) {
    if (strict) {
      throw new Error(
        `Unable to load the middlewares from ` +
          `${descriptor.relativePath}. ` +
          `No config found. Did you export a config object?`
      )
    } else {
      logger.info(
        `Skipping loading middlewares from ` +
          `${descriptor.relativePath}. ` +
          `No config found. Did you export a config object?`
      )
    }
  }

  if (config?.ignore) {
    logger.info(
      `Skipping loading middlewares from ` +
        `${descriptor.relativePath}. ` +
        `Ignore flag set to true.`
    )
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
function parseRoute(route: string): string {
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
 * @param {boolean?} strict If set to true, then every file must export a config
 *
 * @return {Promise<void>}
 */
async function retrieveFilesConfig({
  strict,
}: {
  strict?: boolean
}): Promise<void> {
  await Promise.all(
    [...routesMap.values(), ...globalMiddlewaresMap.values()].map(
      async (descriptor: RouteDescriptor | GlobalMiddlewareDescriptor) => {
        const absolutePath = descriptor.absolutePath
        const isGlobalMiddleware = isMiddlewaresDir(descriptor.route)

        return await import(absolutePath).then((imp) => {
          const map = isGlobalMiddleware ? globalMiddlewaresMap : routesMap

          if (isGlobalMiddleware) {
            validateMiddlewareConfig(
              descriptor as GlobalMiddlewareDescriptor,
              imp.config,
              strict
            )
          } else {
            validateRouteConfig(descriptor, imp.config, strict)
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

/**
 * Walks through a directory and returns all files in the directory recursively
 *
 * @param {string} dirPath
 * @param {string?} rootPath
 * @param {boolean?} isInMiddlewaresDirectory
 *
 * @return {Promise<void>}
 */
async function walkThrough(
  dirPath: string,
  rootPath?: string,
  isInMiddlewaresDirectory?: boolean
): Promise<void> {
  await Promise.all(
    await readdir(dirPath, { withFileTypes: true }).then((entries) => {
      return entries
        .map((entry) => {
          const shouldContinue =
            entry.isDirectory() ||
            !excludeExtensions.some((extension) => {
              return entry.name.endsWith(extension)
            })

          if (!shouldContinue) {
            return
          }

          let childPath = join(dirPath, entry.name)
          isInMiddlewaresDirectory = isMiddlewaresDir(dirPath)

          if (entry.isDirectory()) {
            return [
              walkThrough(
                childPath,
                rootPath ?? dirPath,
                isInMiddlewaresDirectory
              ),
            ]
          }

          const descriptor: RouteDescriptor | GlobalMiddlewareDescriptor = {
            absolutePath: childPath,
            relativePath: "",
            route: "",
            priority: Infinity,
          }

          const map = isInMiddlewaresDirectory
            ? globalMiddlewaresMap
            : routesMap
          map.set(childPath, descriptor)

          // Remove the rootPath from the childPath
          if (rootPath) {
            childPath = childPath.replace(rootPath, "")
          }

          // logger.info(`Found file ${childPath}`);

          // File path without the root path
          descriptor.relativePath = childPath

          // The path on which the route will be registered on
          let routeToParse = childPath

          const pathSegments = childPath.split("/")
          const lastSegment = pathSegments[pathSegments.length - 1]

          if (lastSegment.startsWith("index")) {
            pathSegments.pop()
            routeToParse = pathSegments.join("/")
          }

          descriptor.route = parseRoute(routeToParse)
          descriptor.priority = calculatePriority(descriptor.route)
          return
        })
        .flat(Infinity)
    })
  )
}

/**
 * Register the routes to the express app
 *
 * @param {Express} app
 * @param {OnRouteLoadingHook<TConfig>}onRouteLoading A hook that will be called
 * when a route is being loaded
 *
 * @return {Promise<void>}
 */
async function registerRoutesAndMiddlewares<TConfig>(
  app: Express,
  onRouteLoading?: OnRouteLoadingHook<TConfig>
) {
  const prioritizedMiddlewares = prioritize([...globalMiddlewaresMap.values()])
  const prioritizedRoutes = prioritize([...routesMap.values()])

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
        logger.info(
          // eslint-disable-next-line max-len
          `Registering middleware [${route.method?.toUpperCase()}${createSpacingSting(
            route.method?.length
          )}] - ${route.path}`
        )

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(app as any)[route.method!.toLowerCase()](
          route.path,
          ...route.middlewares
        )
      }

      continue
    }

    await onRouteLoading?.(descriptor as RouteDescriptor<TConfig>)

    const routes = descriptor.config.routes! as RouteConfig[]

    for (const route of routes) {
      logger.info(
        // eslint-disable-next-line max-len
        `Registering route [${route.method?.toUpperCase()}${createSpacingSting(
          route.method?.length
        )}] - ${descriptor.route}`
      )

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(app as any)[route.method!.toLowerCase()](
        descriptor.route,
        ...route.handlers
      )
    }
  }
}

/**
 * Archipelago will walk through the rootDir and load all files if they need
 * to be loaded
 *
 * @param {Express} app
 * @param {string} rootDir The directory to walk through
 * @param {OnRouteLoadingHook} onRouteLoading A hook that will be called when a
 * route is being loaded
 * @param {boolean?} strict If set to true, then every file must export a config
 *
 * @return {Promise<Express>}
 */
export default async function loadRoutes<TConfig = unknown>(
  app: Express,
  {
    rootDir,
    onRouteLoading,
    strict,
  }: {
    rootDir: string
    onRouteLoading?: OnRouteLoadingHook<TConfig>
    strict?: boolean
  }
) {
  const start = Date.now()

  logger.info(`Loading routes from ${rootDir}`)

  await walkThrough(rootDir)
  await retrieveFilesConfig({ strict })
  await registerRoutesAndMiddlewares(app, onRouteLoading)

  const end = Date.now()
  const timeSpent = (end - start).toFixed(3)
  logger.info(`Routes loaded in ${timeSpent} ms`)

  return app
}

export * from "./types"
