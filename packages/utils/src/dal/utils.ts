import { isDefined, isObject } from "../common"

export async function transactionWrapper<TManager = unknown>(
  this: any,
  task: (transactionManager: unknown) => Promise<any>,
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

  const transactionMethod =
    this.manager_.transaction ?? this.manager_.transactional
  return await transactionMethod.bind(this.manager_)(task, options)
}

/**
 * Can be used to create a new Object that collect the ids of all entities
 * based on the columnLookup. This is useful when you want to soft delete entities and return
 * an object where the keys are the entities name and the values are the ids of the entities
 * that were soft deleted.
 *
 * @param entities
 * @param columnLookup
 * @param map
 * @param getEntityName
 */
export function getSoftDeletedCascadedEntitiesIdsMappedBy({
  entities,
  columnLookup,
  map,
  getEntityName,
}: {
  entities: any[]
  columnLookup: string
  map?: Map<string, string[]>
  getEntityName?: (entity: any) => string
}) {
  columnLookup ??= "id"
  map ??= new Map<string, string[]>()
  getEntityName ??= (entity) => entity.constructor.name

  for (const entity of entities) {
    const entityName = getEntityName(entity)
    const shouldSkip =
      map.has(entityName) && map.get(entityName)!.includes(entity.id)

    if (!entity.deleted_at || shouldSkip) {
      continue
    }

    const ids = map.get(entityName) ?? []
    ids.push(entity.id)
    map.set(entityName, ids)

    Object.values(entity).forEach((propValue: any) => {
      if (
        propValue != null &&
        isDefined(propValue[0]) &&
        isObject(propValue[0])
      ) {
        getSoftDeletedCascadedEntitiesIdsMappedBy({
          entities: propValue,
          columnLookup,
          map,
          getEntityName,
        })
      }
    })
  }

  return Object.fromEntries(map)
}
