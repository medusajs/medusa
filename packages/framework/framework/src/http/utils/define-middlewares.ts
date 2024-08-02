import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaRequestHandler,
  MedusaResponse,
  MiddlewaresConfig,
  MiddlewareVerb,
  ParserConfig,
} from "../types"
import { ZodObject } from "zod"

/**
 * A helper function to configure the routes by defining custom middleware,
 * bodyparser config and validators to be merged with the pre-existing
 * route validators.
 */
export function defineMiddlewares<
  Route extends {
    method?: MiddlewareVerb | MiddlewareVerb[]
    matcher: string | RegExp
    bodyParser?: ParserConfig
    additionalDataValidator?: ZodObject<any, any>
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
      const { middlewares, additionalDataValidator, ...rest } = route
      const customMiddleware: MedusaRequestHandler[] = []

      /**
       * Define a custom validator when a zod schema is provided via
       * "additionalDataValidator" property
       */
      if (additionalDataValidator) {
        customMiddleware.push((req, _, next) => {
          req.additionalDataValidator = additionalDataValidator
          next()
        })
      }

      return {
        ...rest,
        middlewares: customMiddleware.concat(middlewares || []),
      }
    }),
  }
}
