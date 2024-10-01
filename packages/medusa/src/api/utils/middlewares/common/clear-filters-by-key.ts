import { NextFunction } from "express"
import { MedusaRequest } from "@medusajs/framework/http"

export function clearFiltersByKey(keys: string[]) {
  return async (req: MedusaRequest, _, next: NextFunction) => {
    keys.forEach((key) => {
      delete req.filterableFields[key]
    })

    return next()
  }
}
