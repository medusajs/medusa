import { NextFunction, Request, RequestHandler, Response } from "express"

// Optional customer authentication
// If authenticated, middleware attaches customer to request (as user) otherwise we pass through
// If you want to require authentication, use `requireCustomerAuthentication` in `packages/medusa/src/api/middlewares/require-customer-authentication.ts`
export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authService = req.scope.resolve("authService")
    const asyncHandler = fn => (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next)
    }
    asyncHandler(authService.verifyCustomerSession(req, res, next))
  }
}
