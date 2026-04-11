import memoize from "lodash.memoize"
import logger from "@medusajs/cli/dist/reporter"
import { json, NextFunction, RequestHandler, text, urlencoded } from "express"

import type {
  MedusaRequest,
  MedusaResponse,
  MiddlewareVerb,
  ParserConfigArgs,
  MiddlewareFunction,
  BodyParserConfigRoute,
} from "../types"
import type { RoutesFinder } from "../routes-finder"

/**
 * Parsers to use for parsing the HTTP request body
 */
const parsers = {
  json: memoize(function jsonParserMiddleware(options?: ParserConfigArgs) {
    return json({
      limit: options?.sizeLimit,
      verify: options?.preserveRawBody
        ? (req: MedusaRequest, res: MedusaResponse, buf: Buffer) => {
            req.rawBody = buf
          }
        : undefined,
    })
  }),
  text: memoize(function textParser(options?: ParserConfigArgs) {
    return text({
      limit: options?.sizeLimit,
    })
  }),
  urlencoded: memoize(function urlencodedParserMiddleware(
    options?: ParserConfigArgs
  ) {
    return urlencoded({
      limit: options?.sizeLimit,
      extended: true,
    })
  }),
}

/**
 * Creates the bodyparser middlewares stack that creates custom bodyparsers
 * during an HTTP request based upon the defined config. The bodyparser
 * instances are cached for re-use.
 */
export function createBodyParserMiddlewaresStack(
  route: string,
  routesFinder: RoutesFinder<BodyParserConfigRoute>,
  tracer?: (
    handler: RequestHandler | MiddlewareFunction,
    route: { route: string; method?: string }
  ) => RequestHandler | MiddlewareFunction
): RequestHandler[] {
  return (["json", "text", "urlencoded"] as (keyof typeof parsers)[]).map(
    (parser) => {
      function bodyParser(
        req: MedusaRequest,
        res: MedusaResponse,
        next: NextFunction
      ) {
        const matchingRoute = routesFinder.find(
          req.path,
          req.method as MiddlewareVerb
        )
        const parserMiddleware = parsers[parser]

        if (!matchingRoute) {
          return parserMiddleware()(req, res, next)
        }

        if (matchingRoute.config === false) {
          logger.debug(
            `skipping ${parser} bodyparser middleware ${req.method} ${req.path}`
          )
          return next()
        }

        logger.debug(
          `using custom ${parser} bodyparser config ${req.method} ${req.path}`
        )
        return parserMiddleware(matchingRoute.config)(req, res, next)
      }

      Object.defineProperty(bodyParser, "name", {
        value: `${parser}BodyParser`,
      })

      return (
        tracer ? tracer(bodyParser, { route }) : bodyParser
      ) as RequestHandler
    }
  )
}
