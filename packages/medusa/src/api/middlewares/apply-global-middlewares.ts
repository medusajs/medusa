import { RequestHandler } from "express-serve-static-core"
import { checkCustomErrors } from "./check-custom-errors"
import { awaitMiddleware } from "./index"
import { PartialRequestHandler } from "./await-middleware"
import { Router, RouterOptions } from "express"

export function applyGlobalMiddlewares(
  router: (options?: RouterOptions) => Router
) {
  ;["get", "post", "put", "delete"].forEach(function (method: string): void {
    router[method] = function (path: string, ...handlers: RequestHandler[]) {
      const route = (this as unknown as Router).route(path)
      const finalHandler = handlers.pop() as RequestHandler
      handlers = [
        ...handlers,
        checkCustomErrors,
        awaitMiddleware(finalHandler as PartialRequestHandler),
      ]
      // eslint-disable-next-line prefer-spread
      route[method].apply(route, handlers)
      return this
    }
  })
}
