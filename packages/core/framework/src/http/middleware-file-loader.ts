import { z } from "@medusajs/deps/zod"
import { dynamicImport, FileSystem, isFileSkipped } from "@medusajs/utils"
import { join } from "path"

import { logger } from "../logger"
import {
  type AdditionalDataValidatorRoute,
  type BodyParserConfigRoute,
  HTTP_METHODS,
  type MedusaErrorHandlerFunction,
  type MiddlewareDescriptor,
  type MiddlewaresConfig,
} from "./types"

/**
 * File name that is used to indicate that the file is a middleware file
 */
const MIDDLEWARE_FILE_NAME = "middlewares"

/**
 * Exposes the API to scan a directory and load the `middleware.ts` file. This file contains
 * the configuration for certain global middlewares and core routes validators. Also, it may
 * contain custom middlewares.
 */
export class MiddlewareFileLoader {
  /**
   * Global error handler exported from the middleware file loader
   */
  #errorHandler?: MedusaErrorHandlerFunction

  /**
   * Middleware collected manually or by scanning directories
   */
  #middleware: MiddlewareDescriptor[] = []

  /**
   * Route matchers on which a custom additional data validator is
   * defined
   */
  #additionalDataValidatorRoutes: AdditionalDataValidatorRoute[] = []

  /**
   * Route matchers on which a custom body parser config is used
   */
  #bodyParserConfigRoutes: BodyParserConfigRoute[] = []

  /**
   * Processes the middleware file and returns the middleware and the
   * routes config exported by it.
   */
  async #processMiddlewareFile(absolutePath: string): Promise<void> {
    const middlewareExports = await dynamicImport(absolutePath)

    if (isFileSkipped(middlewareExports)) {
      return
    }

    const middlewareConfig = middlewareExports.default
    if (!middlewareConfig) {
      logger.warn(
        `No middleware configuration found in ${absolutePath}. Skipping middleware configuration.`
      )
      return
    }

    const routes = middlewareConfig.routes as MiddlewaresConfig["routes"]
    if (!routes || !Array.isArray(routes)) {
      logger.warn(
        `Invalid default export found in ${absolutePath}. Make sure to use "defineMiddlewares" function and export its output.`
      )
      return
    }

    const result = routes.reduce<{
      bodyParserConfigRoutes: BodyParserConfigRoute[]
      additionalDataValidatorRoutes: AdditionalDataValidatorRoute[]
      middleware: MiddlewareDescriptor[]
    }>(
      (result, route) => {
        if (!route.matcher) {
          throw new Error(
            `Middleware is missing a \`matcher\` field. The 'matcher' field is required when applying middleware. ${JSON.stringify(
              route,
              null,
              2
            )}`
          )
        }

        const matcher = String(route.matcher)

        if (route.bodyParser !== undefined) {
          let methods = route.methods || [...HTTP_METHODS]
          if (methods.includes("ALL")) {
            methods = [...HTTP_METHODS]
          }

          logger.debug(
            `using custom bodyparser config on matcher ${methods}:${route.matcher}`
          )

          result.bodyParserConfigRoutes.push({
            matcher: matcher,
            methods,
            config: route.bodyParser,
          })
        }

        if (route.additionalDataValidator !== undefined) {
          let methods = route.methods || [...HTTP_METHODS]
          if (methods.includes("ALL")) {
            methods = [...HTTP_METHODS]
          }

          logger.debug(
            `assigning additionalData validator on matcher ${methods}:${route.matcher}`
          )

          result.additionalDataValidatorRoutes.push({
            matcher: matcher,
            methods,
            schema: route.additionalDataValidator,
            validator: z.object(route.additionalDataValidator).nullish(),
          })
        }

        if (route.middlewares || route.policies) {
          const middlewares = route.middlewares ?? []
          if (route.policies && !route.middlewares?.length) {
            middlewares.push((_, __, next) => {
              next()
            })
          }

          middlewares.forEach((middleware) => {
            result.middleware.push({
              handler: middleware,
              matcher: matcher,
              methods: route.methods,
              policies: route.policies,
            })
          })
        }
        return result
      },
      {
        bodyParserConfigRoutes: [],
        additionalDataValidatorRoutes: [],
        middleware: [],
      }
    )

    const errorHandler =
      middlewareConfig.errorHandler as MiddlewaresConfig["errorHandler"]

    if (errorHandler) {
      this.#errorHandler = errorHandler
    }
    this.#middleware = this.#middleware.concat(result.middleware)
    this.#bodyParserConfigRoutes = this.#bodyParserConfigRoutes.concat(
      result.bodyParserConfigRoutes
    )
    this.#additionalDataValidatorRoutes =
      this.#additionalDataValidatorRoutes.concat(
        result.additionalDataValidatorRoutes
      )
  }

  /**
   * Scans a given directory for the "middleware.ts" or "middleware.js" files and
   * imports them for reading the registered middleware and configuration for
   * existing routes/middleware.
   */
  async scanDir(sourceDir: string) {
    const fs = new FileSystem(sourceDir)
    if (await fs.exists(`${MIDDLEWARE_FILE_NAME}.ts`)) {
      await this.#processMiddlewareFile(
        join(sourceDir, `${MIDDLEWARE_FILE_NAME}.ts`)
      )
    } else if (await fs.exists(`${MIDDLEWARE_FILE_NAME}.js`)) {
      await this.#processMiddlewareFile(
        join(sourceDir, `${MIDDLEWARE_FILE_NAME}.js`)
      )
    }
  }

  /**
   * Returns the globally registered error handler (if any)
   */
  getErrorHandler() {
    return this.#errorHandler
  }

  /**
   * Returns a collection of registered middleware
   */
  getMiddlewares() {
    return this.#middleware
  }

  /**
   * Returns routes that have bodyparser config on them
   */
  getBodyParserConfigRoutes() {
    return this.#bodyParserConfigRoutes
  }

  /**
   * Returns routes that have additional validator configured
   * on them
   */
  getAdditionalDataValidatorRoutes() {
    return this.#additionalDataValidatorRoutes
  }
}
