import { MedusaNextFunction, MedusaRequest } from "../types"

export function clearFiltersByKey(keys: string[]) {
  return async (req: MedusaRequest, _, next: MedusaNextFunction) => {
    keys.forEach((key) => {
      delete req.filterableFields[key]
    })

    return next()
  }
}
