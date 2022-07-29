import { NextFunction, Request, Response, RequestHandler } from "express"

export type PartialRequestHandler = (
  req: Request,
  res: Response
) => Promise<void>

export default (fn: PartialRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res).catch(next)
  }
}
