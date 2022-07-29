import { NextFunction, Request, Response } from "express"

export function checkCustomErrors(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (req?.errors?.length) {
    return res.status(400).json({
      errors: req.errors,
      message:
        "Provided request body contains errors. Please check the data and retry the request",
    })
  }
  next()
}
