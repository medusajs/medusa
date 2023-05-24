import { Logger, MedusaContainer } from "@medusajs/types"
import { Express } from "express"
import glob from "glob"
import { PluginDetails } from "../plugins"

type CustomMiddlewareConfig = {
  path: string | string[]
}

type CustomMiddlewareExports = {
  config: CustomMiddlewareConfig
  default: any
}

/**
 * Registers the plugin's api routes.
 */
export function registerMiddleware(
  pluginDetails: PluginDetails,
  app: Express,
  container: MedusaContainer,
  activityId: string
): Express {
  const logger = container.resolve<Logger>("logger")
  logger.progress(
    activityId,
    `Registering custom middleware for ${pluginDetails.name}`
  )
  try {
    const middlewares = glob.sync(
      `${pluginDetails.resolve}/middlewares/**/[!__]*.js`,
      {}
    )

    const isCustomMiddleware = (middleware: CustomMiddlewareExports) =>
      "default" in middleware && "config" in middleware

    for (const middlewareFile of middlewares) {
      const middleware = require(middlewareFile)

      if (!isCustomMiddleware(middleware)) {
        continue
      }

      const { config, default: middlewareFunction }: CustomMiddlewareExports =
        middleware

      app.use(config.path, middlewareFunction)
    }

    return app
  } catch (err) {
    if (
      err.message !== `Cannot find module '${pluginDetails.resolve}/middlewares'`
    ) {
      logger.progress(
        activityId,
        `Failed to register custom middleware for ${pluginDetails.name}`
      )
    }

    return app
  }
}
