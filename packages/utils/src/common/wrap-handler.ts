import { NextFunction, Request, RequestHandler, Response } from "express"

type handler = (req: Request, res: Response) => Promise<void>

export const wrapHandler = (fn: handler): RequestHandler => {
  return (
    req: Request & { errors?: Error[] },
    res: Response,
    next: NextFunction
  ) => {
    if (req?.errors?.length) {
      return res.status(400).json({
        errors: req.errors,
        message:
          "Provided request body contains errors. Please check the data and retry the request",
      })
    }

    return fn(req, res).catch(next)
  }
}

/**
 * @schema MultipleErrors
 * title: "Multiple Errors"
 * type: object
 * properties:
 *  errors:
 *    type: array
 *    description: Array of errors
 *    items:
 *      $ref: "#/components/schemas/Error"
 *  message:
 *    type: string
 *    default: "Provided request body contains errors. Please check the data and retry the request"
 */
