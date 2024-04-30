import { isObject, isPresent } from "@medusajs/utils"
import { NextFunction } from "express"
import { MedusaRequest } from "../../../../types/routing"

export function applyDefaultFilters<TFilter extends object>(
  filtersToApply: TFilter
) {
  return async (req: MedusaRequest, _, next: NextFunction) => {
    for (const [filter, filterValue] of Object.entries(filtersToApply)) {
      let valueToApply = filterValue

      // If certain manipulations need to be done on a middleware level, we can provide a simple
      // function that mutates the data based on any custom requirement
      if (typeof filterValue === "function") {
        // pass the actual filterable fields so that the function can mutate the original object.
        // Currently we only need it to delete filter keys from the request filter object, but this could
        // be used for other purposes. If we can't find other purposes, we can refactor to accept an array
        // of strings to delete after filters have been applied.
        valueToApply = filterValue(
          req.filterableFields,
          req.remoteQueryConfig.fields
        )
      }

      // If the value to apply is an object, we add it to any existing filters thats already applied
      if (isObject(valueToApply)) {
        req.filterableFields[filter] = {
          ...(req.filterableFields[filter] || {}),
          ...valueToApply,
        }
      } else if (isPresent(valueToApply)) {
        req.filterableFields[filter] = valueToApply
      }
    }

    return next()
  }
}
