import passport from "passport"
import { Request, Response, NextFunction, RequestHandler } from "express"

export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(
      ["jwt", "bearer"],
      { session: false },
      (err, user) => {
        if (err) {
          return next(err)
        }
        req.user = user
        return next()
      }
    )(req, res, next)
  }
}
