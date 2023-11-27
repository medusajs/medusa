import { Context, DAL, FindConfig } from "@medusajs/types"
import {
  MedusaError,
  isDefined,
  lowerCaseFirst,
  upperCaseFirst,
} from "../common"
import { buildQuery } from "./build-query"

type RetrieveEntityParams<TDTO> = {
  id: string
  identifierColumn?: string
  entityName: string
  repository: DAL.TreeRepositoryService | DAL.RepositoryService
  config: FindConfig<TDTO>
  sharedContext?: Context
}

export async function retrieveEntity<TEntity, TDTO>({
  id,
  identifierColumn = "id",
  entityName,
  repository,
  config = {},
  sharedContext,
}: RetrieveEntityParams<TDTO>): Promise<TEntity> {
  if (!isDefined(id)) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `"${lowerCaseFirst(entityName)}${upperCaseFirst(
        identifierColumn
      )}" must be defined`
    )
  }

  const queryOptions = buildQuery<TEntity>(
    {
      [identifierColumn]: id,
    },
    config
  )

  const entities = await repository.find(queryOptions, sharedContext)

  if (!entities?.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `${entityName} with ${identifierColumn}: ${id} was not found`
    )
  }

  return entities[0]
}
