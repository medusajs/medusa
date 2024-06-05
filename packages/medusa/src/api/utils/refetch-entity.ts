import { MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  isString,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

export const refetchEntities = async (
  entryPoint: string,
  idOrFilter: string | object,
  scope: MedusaContainer,
  fields: string[],
  pagination: object = {}
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const filters = isString(idOrFilter) ? { id: idOrFilter } : idOrFilter
  let context: object = {}

  if ("context" in filters) {
    if (filters.context) {
      context = filters.context!
    }

    delete filters.context
  }

  const variables = { filters, ...context, ...pagination }

  const queryObject = remoteQueryObjectFromString({
    entryPoint,
    variables,
    fields,
  })

  return await remoteQuery(queryObject)
}

export const refetchEntity = async (
  entryPoint: string,
  idOrFilter: string | object,
  scope: MedusaContainer,
  fields: string[]
) => {
  const [entity] = await refetchEntities(entryPoint, idOrFilter, scope, fields)

  return entity
}
