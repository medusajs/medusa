import { NextFunction, Request, RequestHandler, Response } from "express"

export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authService = req.scope.resolve("authService")
    const asyncHandler = fn => (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next)
    }
    asyncHandler(authService.verifySession(req, res, next))
  }
}
