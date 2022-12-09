import { NextFunction, Request, RequestHandler, Response } from "express"
import passport from "passport"

export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.user) {
      return next()
    }

    passport.authenticate(["store-jwt", "bearer"], { session: false })(
      req,
      res,
      next
    )
  }
}
