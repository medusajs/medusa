import { MedusaNextFunction, MedusaRequest } from "../types"

export function applyParamsAsFilters(mappings: { [param: string]: string }) {
  return async (req: MedusaRequest, _, next: MedusaNextFunction) => {
    for (const [param, paramValue] of Object.entries(req.params)) {
      if (mappings[param]) {
        req.filterableFields[mappings[param]] = paramValue
      }
    }

    return next()
  }
}
