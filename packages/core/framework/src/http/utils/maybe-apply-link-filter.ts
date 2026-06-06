import { ContainerRegistrationKeys } from "@zjedene-medusa/utils"
import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "../types"

export function maybeApplyLinkFilter({
  entryPoint,
  resourceId,
  filterableField,
  filterByField = "id",
}) {
  return async function linkFilter(
    req: MedusaRequest,
    _: MedusaResponse,
    next: MedusaNextFunction
  ) {
    const filterableFields = req.filterableFields

    if (!filterableFields?.[filterableField]) {
      return next()
    }

    const filterFields = filterableFields[filterableField]

    const idsToFilterBy = Array.isArray(filterFields)
      ? filterFields
      : [filterFields]

    delete filterableFields[filterableField]

    let existingFilters = filterableFields[filterByField] as
      | string[]
      | string
      | undefined

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const filters: Record<string, unknown> = {
      [filterableField]: idsToFilterBy,
    }

    if (existingFilters) {
      filters[resourceId] = existingFilters
    }

    const { data: resources } = await query.graph({
      entity: entryPoint,
      fields: [resourceId],
      filters,
    })

    filterableFields[filterByField] = resources.map((p) => p[resourceId])

    req.filterableFields = transformFilterableFields(filterableFields)

    return next()
  }
}
/*
  Transforms an object key string into nested objects
  before = {
    "test.something.another": []
  }

  after = {
    test: {
      something: {
        another: []
      }
    }
  }
*/
function transformFilterableFields(filterableFields: Record<string, unknown>) {
  const result = {}
  for (const key of Object.keys(filterableFields)) {
    const value = filterableFields[key]
    const keys = key.split(".")
    let current = result

    // Iterate over the keys, creating nested objects as needed
    for (let i = 0; i < keys.length; i++) {
      const part = keys[i]
      current[part] ??= {}

      if (i === keys.length - 1) {
        // If its the last key, assign the value
        current[part] = value
        break
      }

      current = current[part]
    }
  }

  return result
}
