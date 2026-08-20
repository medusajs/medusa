import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  MiddlewareFunction,
} from "../types"

/**
 * Due to how our route loader works, where we load all middlewares before routes, ambiguous routes * end up having all middlewares on different routes executed before the route handler is.
 */
/**
 * This function allows us to skip middlewares for particular routes, so we can temporarily solve * * this without completely breaking the route loader for everyone.
 */
export const unlessPath = (onPath: RegExp, middleware: MiddlewareFunction) => {
  /**
   * `test` advances `lastIndex` on a global or sticky expression, so the same
   * instance alternates between matching and not matching the same path across
   * requests. Match against a copy, reset per request, so the result only
   * depends on the path — and the caller's expression is never mutated.
   */
  const matcher = new RegExp(onPath.source, onPath.flags)

  return (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    matcher.lastIndex = 0

    if (matcher.test(req.path)) {
      return next()
    } else {
      return middleware(req, res, next)
    }
  }
}
