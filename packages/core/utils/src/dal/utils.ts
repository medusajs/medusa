import { isObject } from "../common"

export async function transactionWrapper<TManager = unknown>(
  manager: any,
  task: (transactionManager: any) => Promise<any>,
  {
    transaction,
    isolationLevel,
    enableNestedTransactions = false,
  }: {
    isolationLevel?: string
    transaction?: TManager
    enableNestedTransactions?: boolean
  } = {}
): Promise<any> {
  // Reuse the same transaction if it is already provided and nested transactions are disabled
  if (!enableNestedTransactions && transaction) {
    return await task(transaction)
  }

  const options = {}

  if (transaction) {
    Object.assign(options, { ctx: transaction })
  }

  if (isolationLevel) {
    Object.assign(options, { isolationLevel })
  }

  const transactionMethod = manager.transaction ?? manager.transactional
  return await transactionMethod.bind(manager)(task, options)
}

/**
 * Can be used to create a new Object that collect the entities
 * based on the columnLookup. This is useful when you want to soft delete entities and return
 * an object where the keys are the entities name and the values are the entities
 * that were soft deleted.
 *
 * @param entities
 * @param deletedEntitiesMap
 * @param getEntityName
 */
export function getSoftDeletedCascadedEntitiesIdsMappedBy({
  entities,
  deletedEntitiesMap,
  getEntityName,
  restored,
}: {
  entities: any[]
  deletedEntitiesMap?: Map<string, any[]>
  getEntityName?: (entity: any) => string
  restored?: boolean
}): Record<string, any[]> {
  deletedEntitiesMap ??= new Map<string, any[]>()
  getEntityName ??= (entity) => entity.constructor.name

  for (const entity of entities) {
    const entityName = getEntityName(entity)
    const shouldSkip = !!deletedEntitiesMap
      .get(entityName)
      ?.some((e) => e.id === entity.id)

    if ((restored ? !!entity.deleted_at : !entity.deleted_at) || shouldSkip) {
      continue
    }

    const values = deletedEntitiesMap.get(entityName) ?? []
    values.push(entity)
    deletedEntitiesMap.set(entityName, values)

    Object.values(entity).forEach((propValue: any) => {
      if (propValue != null && isObject(propValue[0])) {
        getSoftDeletedCascadedEntitiesIdsMappedBy({
          entities: propValue,
          deletedEntitiesMap,
          getEntityName,
        })
      }
    })
  }

  return Object.fromEntries(deletedEntitiesMap)
}
