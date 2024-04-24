import { isObject } from "@medusajs/utils"
import { NextFunction } from "express"
import { MedusaRequest } from "../../../../types/routing"

export function applyDefaultFilters<TFilter extends object>(filters: TFilter) {
  return async (req: MedusaRequest, _, next: NextFunction) => {
    const filterableFields = req.filterableFields || {}

    for (const [filter, filterValue] of Object.entries(filters)) {
      let existingFilter = filterableFields[filter]

      if (existingFilter && isObject(existingFilter)) {
        // If an existing filter is found, append to it
        filterableFields[filter] = {
          ...existingFilter,
          [filter]: filterValue,
        }
      } else {
        filterableFields[filter] = filterValue
      }
    }

    req.filterableFields = filterableFields

    return next()
  }
}
