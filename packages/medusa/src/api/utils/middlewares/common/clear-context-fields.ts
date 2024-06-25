import { NextFunction } from "express"
import { MedusaRequest } from "../../../../types/routing"

export function clearContextFields(fields: string[]) {
  return async (req: MedusaRequest, _, next: NextFunction) => {
    fields.forEach((field) => {
      delete req.filterableFields[field]
    })

    return next()
  }
}
