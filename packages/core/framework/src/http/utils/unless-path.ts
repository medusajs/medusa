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
export const unlessPath = (
  onPath: RegExp,
  middleware: MiddlewareFunction
) => {
  /**
   * Regular expressions carrying the `g` or `y` flag keep a `lastIndex` between calls to `test`,
   * so reusing the caller's instance makes the same path match on one request and miss on the
   * next. We test against our own copy and reset it every time, which keeps each request
   * independent and leaves the caller's regular expression untouched.
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
