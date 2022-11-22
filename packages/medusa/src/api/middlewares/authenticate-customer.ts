import { NextFunction, Request, RequestHandler, Response } from "express"
import passport from "passport"

// If authenticated, middleware attaches customer to request (as user) otherwise we pass through
// As an implication of the latter unauthed case, we throw 401s in the controllers that require a customer
export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(
      ["store-jwt", "bearer"],
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
