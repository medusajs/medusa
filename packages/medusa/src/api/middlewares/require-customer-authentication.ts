import { NextFunction, Request, RequestHandler, Response } from "express"
import passport from "passport"

export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.user) {
      return next()
    }

    passport.authenticate(
      ["store-jwt", "bearer"],
      { session: false },
      (err, user) => {
        if (err) {
          return next(err)
        }

        if (user) {
          req.user = user
        }

        return next()
      }
    )(req, res, next)
  }
}
