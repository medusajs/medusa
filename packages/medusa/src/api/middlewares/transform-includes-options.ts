import { NextFunction, Request, Response } from "express"
import { FindConfig } from "../../types/common"
import { Order } from "../../models"

/**
 * Retrieve the includes options from the select prop of retrieveConfig.
 * If the include option is present then assigned it to includes on req
 * @param allowedIncludesFields The list of fields that can be passed and assign to req.includes
 */
export function transformIncludesOptions(allowedIncludesFields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const includesField of allowedIncludesFields) {
      const fieldIndex =
        (req.retrieveConfig as FindConfig<Order>).select?.indexOf(
          includesField as keyof Order
        ) ?? -1

      const isPresent = fieldIndex !== -1

      if (isPresent) {
        req.retrieveConfig.select?.splice(fieldIndex, 1)
        req["includes"] = req["includes"] ?? {}
        req["includes"][includesField] = true
      }
    }

    next()
  }
}
