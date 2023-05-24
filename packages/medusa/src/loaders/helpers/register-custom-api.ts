import { Logger, MedusaContainer } from "@medusajs/types"
import { Express, NextFunction } from "express"
import glob from "glob"
import { parse } from "path"
import { PluginDetails } from "../plugins"

type CustomEndpointConfig = {
  method: string
  path?: string
  middlewares?: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>[]
}

type CustomEndpointExports = {
  config: CustomEndpointConfig
  default: (req: Request, res: Response) => Promise<void>
}

function formatEndpointPath(
  filePath: string,
  config: CustomEndpointConfig
): string {
  if (config.path) {
    return config.path
  }

  // Find path to register: '/src/api/test.js' -> '/test.js'
  const [, p] = filePath.split("api")
  const parsedPath = parse(p)
  let fileName = parsedPath.name

  // Regex to find dynamic routes e.g. '/[id].js'
  // For multiple params in route, use 'path' option in config instead
  const dynamicRouteRegex = new RegExp(/\[(.*?)\]/)
  const dynamicRouteMath = dynamicRouteRegex.exec(fileName)

  // If dynamic route is found, replace with ':id' to match express query params
  if (dynamicRouteMath) {
    const [, dynamicRoute] = dynamicRouteMath
    fileName = `:${dynamicRoute}`
  }

  let path: string

  // If file is 'index.js', we assume it should be registered at the root path
  if (fileName === "index") {
    path = `${parsedPath.dir}`
  } else {
    // Otherwise, we register it at the path of the file
    if (parsedPath.dir === "/") {
      path = `/${fileName}`
    } else {
      path = `${parsedPath.dir}/${fileName}`
    }
  }

  return path
}

/**
 * Registers the plugin's api routes.
 */
export function registerApi(
  pluginDetails: PluginDetails,
  app: Express,
  rootDirectory = "",
  container: MedusaContainer,
  activityId: string
): Express {
  const logger = container.resolve<Logger>("logger")
  logger.progress(
    activityId,
    `Registering custom endpoints for ${pluginDetails.name}`
  )
  try {
    const routes = glob.sync(`${pluginDetails.resolve}/api/**/[!__]*.js`, {})
    const legacyRoutes = require(`${pluginDetails.resolve}/api`)

    // Compatibility with old API
    if ("default" in legacyRoutes) {
      const routes = legacyRoutes.default
      app.use("/", routes(rootDirectory, pluginDetails))
    }

    const isCustomEndpoint = (endpoint: CustomEndpointExports) =>
      "default" in endpoint && "config" in endpoint

    for (const route of routes) {
      const customEndpoint = require(route)

      if (!isCustomEndpoint(customEndpoint)) {
        continue
      }

      const { config, default: handler }: CustomEndpointExports = customEndpoint

      const path = formatEndpointPath(route, config)

      app[config.method.toLowerCase()](path, config.middlewares ?? [], handler)
    }

    return app
  } catch (err) {
    if (err.message !== `Cannot find module '${pluginDetails.resolve}/api'`) {
      logger.progress(
        activityId,
        `Failed to register custom endpoints for ${pluginDetails.name}`
      )
    }

    return app
  }
}
