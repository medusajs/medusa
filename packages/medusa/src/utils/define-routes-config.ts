import { ZodObject } from "zod"
import {
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
  MedusaRequestHandler,
} from "../types/routing"
import {
  ParserConfig,
  MiddlewareVerb,
  MiddlewaresConfig,
} from "../loaders/helpers/routing/types"

/**
 * A helper function to configure the routes by defining custom middleware,
 * bodyparser config and validators to be merged with the pre-existing
 * route validators.
 */
export function defineRoutesConfig<
  Route extends {
    method?: MiddlewareVerb | MiddlewareVerb[]
    matcher: string | RegExp
    bodyParser?: ParserConfig
    extendedValidators?: {
      body?: ZodObject<any, any>
      queryParams?: ZodObject<any, any>
    }
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
      const { middlewares, extendedValidators, ...rest } = route
      const customMiddleware: MedusaRequestHandler[] = []

      /**
       * Define a custom validator when "extendedValidators.body" or
       * "extendedValidators.queryParams" validation schema is
       * provided.
       */
      if (extendedValidators?.body || extendedValidators?.queryParams) {
        customMiddleware.push((req, _, next) => {
          req.extendedValidators = extendedValidators
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
