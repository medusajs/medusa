import { NextFunction, Request, Response } from "express"
import { FindConfig } from "../../../types/common"
import { Order } from "../../../models"

const INCLUDES_FIELDS = ["returnable_items"] as const

/**
 * Retrieve the includes options from the select prop of retrieveConfig.
 * If the include option is present then assigned it to includes on req
 * @param req
 * @param res
 * @param next
 */
export function applyOrderIncludesOptions(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  for (const includesField of INCLUDES_FIELDS) {
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
