import { NextFunction, Request, RequestHandler, Response } from "express"

type handler = (req: Request, res: Response) => Promise<void>

export default (fn: handler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res).catch(next)
  }
}
