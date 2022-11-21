import { NextFunction, Request, RequestHandler, Response } from "express"
import http from "http"
import passport from "passport"

export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(
      ["store-jwt", "bearer"],
      { session: false },
      (err, user, challengesErrors) => {
        const err_ = err ?? (challengesErrors?.length && challengesErrors[0])
        if (err_) {
          res.statusCode = 401
          res.send(http.STATUS_CODES[res.statusCode])
          return
        }
        req.user = user
        return next()
      }
    )(req, res, next)
  }
}
