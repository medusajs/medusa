import { NextFunction, Request, Response } from "express"

/**
 * Normalize an input query, especially from array like query params to an array type
 * e.g: /admin/orders/?fields[]=id,status,cart_id becomes { fields: ["id", "status", "cart_id"] }
 */
export default (): ((
  req: Request,
  res: Response,
  next: NextFunction
) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.query = Object.entries(req.query).reduce((acc, [key, val]) => {
      if (Array.isArray(val) && val.length === 1) {
        acc[key] = (val as string[])[0].split(",")
      } else {
        acc[key] = val
      }
      return acc
    }, {})

    next()
  }
}
