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
  // RegExp#test is stateful when the pattern carries the global (`g`) or sticky
  // (`y`) flag: a successful test advances `lastIndex`, so the same request path
  // alternates between matching and not on consecutive requests. Strip those flags
  // into a stable matcher once, so each test is independent of the previous one and
  // the caller's RegExp is left untouched.
  const matcher =
    onPath.global || onPath.sticky
      ? new RegExp(onPath.source, onPath.flags.replace(/[gy]/g, ""))
      : onPath

  return (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    if (matcher.test(req.path)) {
      return next()
    } else {
      return middleware(req, res, next)
    }
  }
}
