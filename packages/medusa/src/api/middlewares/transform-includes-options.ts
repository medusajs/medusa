import { NextFunction, Request, Response } from "express"
import { Order } from "../../models"
import { MedusaError } from "medusa-core-utils"

/**
 * Retrieve the includes options from the fields query param.
 * If the include option is present then assigned it to includes on req
 * @param allowedIncludesFields The list of fields that can be passed and assign to req.includes
 * @param expectedIncludesFields The list of fields that the consumer can pass to the end point using this middleware. It is a subset of `allowedIncludesFields`
 */
export function transformIncludesOptions(
  allowedIncludesFields: string[] = [],
  expectedIncludesFields: string[] = []
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!allowedIncludesFields.length || !req.query["fields"]) {
      return next()
    }

    const fields = (req.query["fields"] as string).split(",") ?? []

    for (const includesField of allowedIncludesFields) {
      const fieldIndex = fields.indexOf(includesField as keyof Order) ?? -1

      const isPresent = fieldIndex !== -1

      if (isPresent) {
        fields.splice(fieldIndex, 1)

        if (!expectedIncludesFields.includes(includesField)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `The field "${includesField}" is not supported by this end point. ${
              expectedIncludesFields.length
                ? `The includes fields can be one of entity properties or in [${expectedIncludesFields.join(
                    ", "
                  )}]`
                : ""
            }`
          )
        }

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
