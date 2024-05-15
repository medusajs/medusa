import { NextFunction, Request, RequestHandler, Response } from "express"

// TODO: See how this should look like for v2.
export default (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    return next()
  }
}
