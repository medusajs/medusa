import { NextFunction, Request, RequestHandler, Response } from "express"
import passport from "passport"

// Optional customer authentication
// If authenticated, middleware attaches customer to request (as user) otherwise we pass through
// If you want to require authentication, use `requireCustomerAuthentication` in `packages/medusa/src/api/middlewares/require-customer-authentication.ts`
export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
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
