import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  MiddlewaresConfig,
  MiddlewareVerb,
  ParserConfig,
} from "../types"
import type { ZodRawShape } from "@medusajs/deps/zod"

/**
 * A helper function to configure the routes by defining custom middleware,
 * bodyparser config and validators to be merged with the pre-existing
 * route validators.
 */
export function defineMiddlewares<
  Route extends {
    /**
     * @deprecated. Instead use {@link MiddlewareRoute.methods}
     */
    method?: MiddlewareVerb | MiddlewareVerb[]
    methods?: MiddlewareVerb[]
    matcher: string | RegExp
    bodyParser?: ParserConfig
    additionalDataValidator?: ZodRawShape
    // eslint-disable-next-line space-before-function-paren
    middlewares?: (<Req extends MedusaRequest>(
      req: Req,
      res: MedusaResponse,
      next: MedusaNextFunction
    ) => any)[]
  }
>(
  config:
    | Route[]
    | { routes?: Route[]; errorHandler?: MiddlewaresConfig["errorHandler"] }
): MiddlewaresConfig {
  const routes = Array.isArray(config) ? config : config.routes || []
  const errorHandler = Array.isArray(config) ? undefined : config.errorHandler

  return {
    errorHandler,
    routes: routes.map((route) => {
      let { middlewares, method, methods, ...rest } = route
      if (!methods) {
        methods = Array.isArray(method) ? method : method ? [method] : method
      }

      return {
        ...rest,
        methods,
        middlewares: [...(middlewares ?? [])],
      }
    }),
  }
}
