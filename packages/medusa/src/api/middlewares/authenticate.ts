import { NextFunction, Request, RequestHandler, Response } from "express"
import passport from "passport"

export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(["admin-session", "admin-bearer"], { session: false })(
      req,
      res,
      next
    )
  }
}
