import { NextFunction, Request, Response } from "express"
import { Order } from "../../models"

/**
 * Retrieve the includes options from the fields query param.
 * If the include option is present then assigned it to includes on req
 * @param allowedIncludesFields The list of fields that can be passed and assign to req.includes
 */
export function transformIncludesOptions(allowedIncludesFields: string[] = []) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!allowedIncludesFields.length || !req.query["fields"]) {
      return next()
    }

    const fields = (req.query["fields"] as string).split(",") ?? []

    for (const includesField of allowedIncludesFields) {
      const fieldIndex = fields.indexOf(
          includesField as keyof Order
        ) ?? -1

      const isPresent = fieldIndex !== -1

      if (isPresent) {
        fields.splice(fieldIndex, 1)
        req["includes"] = req["includes"] ?? {}
        req["includes"][includesField] = true
      }
    }

    if (req.query["fields"]) {
      if (fields.length) {
        req.query["fields"] = fields.join(",")
      } else {
        delete req.query["fields"]
      }
    }

    next()
  }
}
