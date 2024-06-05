import { NextFunction } from "express"
import { MedusaRequest } from "../../../../types/routing"

export function applyParamsAsFilters<TFilter extends object>(mappings: {
  [param: string]: string
}) {
  return async (req: MedusaRequest, _, next: NextFunction) => {
    for (const [param, paramValue] of Object.entries(req.params)) {
      if (mappings[param]) {
        req.filterableFields[mappings[param]] = paramValue
      }
    }

    return next()
  }
}
