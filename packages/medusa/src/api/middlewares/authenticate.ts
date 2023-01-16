import { NextFunction, Request, RequestHandler, Response } from "express"
import passport from "passport"

export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(["admin-jwt", "bearer"], { session: false })(
      req,
      res,
      next
    )
  }
}
