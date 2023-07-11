import { FindConfig, DAL, Context } from "@medusajs/types"
import { ModulesSdkUtils, MedusaError, isDefined } from "@medusajs/utils"
import { lowerCaseFirst } from "@medusajs/utils"

type RetrieveEntityParams<TDTO> = {
  id: string,
  entityName: string,
  repository: DAL.TreeRepositoryService
  config: FindConfig<TDTO>
  sharedContext?: Context
}

export async function retrieveEntity<
  TEntity,
  TDTO,
>({
  id,
  entityName,
  repository,
  config = {},
  sharedContext,
}: RetrieveEntityParams<TDTO>): Promise<TEntity> {
  if (!isDefined(id)) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `"${lowerCaseFirst(entityName)}Id" must be defined`
    )
  }

  const queryOptions = ModulesSdkUtils.buildQuery<TEntity>({
    id,
  }, config)

  const entities = await repository.find(
    queryOptions,
    sharedContext
  )

  if (!entities?.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `${entityName} with id: ${id} was not found`
    )
  }

  return entities[0]
}
