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
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const filters = isString(idOrFilter) ? { id: idOrFilter } : idOrFilter
  const queryObject = remoteQueryObjectFromString({
    entryPoint,
    variables: { filters },
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
