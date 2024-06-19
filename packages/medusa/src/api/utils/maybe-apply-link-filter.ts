import {
  arrayIntersection,
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { NextFunction } from "express"
import { MedusaRequest } from "../../types/routing"

export function maybeApplyLinkFilter({
  entryPoint,
  resourceId,
  filterableField,
}) {
  return async (req: MedusaRequest, _, next: NextFunction) => {
    const filterableFields = req.filterableFields

    if (!filterableFields?.[filterableField]) {
      return next()
    }

    const filterFields = filterableFields[filterableField]

    const idsToFilterBy = Array.isArray(filterFields)
      ? filterFields
      : [filterFields]

    delete filterableFields[filterableField]

    const remoteQuery = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const queryObject = remoteQueryObjectFromString({
      entryPoint,
      fields: [resourceId],
      variables: { filters: { [filterableField]: idsToFilterBy } },
    })

    const resources = await remoteQuery(queryObject)

    let existingIdFilters = filterableFields.id as string[] | string | undefined
    if (existingIdFilters) {
      if (typeof existingIdFilters === "string") {
        existingIdFilters = [existingIdFilters]
      }

      filterableFields.id = arrayIntersection(
        existingIdFilters,
        resources.map((p) => p[resourceId])
      )
    } else {
      filterableFields.id = resources.map((p) => p[resourceId])
    }

    return next()
  }
}
