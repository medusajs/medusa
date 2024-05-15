import { NextFunction, Request, RequestHandler, Response } from "express"

// TODO: See how this should look like for v2.
// Optional customer authentication
// If authenticated, middleware attaches customer to request (as user) otherwise we pass through
// If you want to require authentication, use `requireCustomerAuthentication` in `packages/medusa/src/api/middlewares/require-customer-authentication.ts`
export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    return next()
  }
}
