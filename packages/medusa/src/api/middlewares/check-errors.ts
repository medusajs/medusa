import { NextFunction, Request, Response } from "express"

export function checkErrorsOrContinue(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.errors?.length) {
    return next()
  }

  return res.status(400).json({
    errors: req.errors,
    message:
      "Provided request body contains errors. Please check the data and retry the request",
  })
}
