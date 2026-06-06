import { EntityMetadata, FindOptions } from "@zjedene-medusa/deps/mikro-orm/core"
import { SqlEntityManager } from "@zjedene-medusa/deps/mikro-orm/postgresql"
import { promiseAll } from "../../common"
import { isString } from "../../common/is-string"
import { buildQuery } from "../../modules-sdk/build-query"

function detectCircularDependency(
  manager: SqlEntityManager,
  entityMetadata: EntityMetadata,
  visited: Set<string> = new Set(),
  shouldStop: boolean = false
) {
  if (shouldStop) {
    return
  }

  visited.add(entityMetadata.className)

  const relations = entityMetadata.relations

  const relationsToCascade = relations.filter((relation) =>
    relation.cascade?.includes("soft-remove" as any)
  )

  for (const relation of relationsToCascade) {
    const branchVisited = new Set(Array.from(visited))

    const relationEntity =
      typeof relation.entity === "function"
        ? relation.entity()
        : relation.entity
    const isSelfCircularDependency = isString(relationEntity)
      ? entityMetadata.className === relationEntity
      : entityMetadata.class === relationEntity

    if (!isSelfCircularDependency && branchVisited.has(relation.name)) {
      const dependencies = Array.from(visited)
      dependencies.push(entityMetadata.className)
      const circularDependencyStr = dependencies.join(" -> ")

      throw new Error(
        `Unable to soft delete the ${relation.name}. Circular dependency detected: ${circularDependencyStr}`
      )
    }
    branchVisited.add(relation.name)

    const relationEntityMetadata = manager
      .getDriver()
      .getMetadata()
      .get(relation.type)

    detectCircularDependency(
      manager,
      relationEntityMetadata,
      branchVisited,
      isSelfCircularDependency
    )
  }
}

async function performCascadingSoftDeletion<T>(
  manager: SqlEntityManager,
  entity: T & { id: string; deleted_at?: string | Date | null },
  value: Date | null,
  softDeletedEntitiesMap: Map<
    string,
    (T & { id: string; deleted_at?: string | Date | null })[]
  > = new Map()
) {
  if (!("deleted_at" in entity)) return

  entity.deleted_at = value

  const softDeletedEntityMapItem = softDeletedEntitiesMap.get(
    entity.constructor.name
  )
  if (!softDeletedEntityMapItem) {
    softDeletedEntitiesMap.set(entity.constructor.name, [entity])
  } else {
    softDeletedEntityMapItem.push(entity)
  }

  const entityName = entity.constructor.name
  const entityMetadata = manager.getDriver().getMetadata().get(entityName)
  const relations = entityMetadata.relations

  const relationsToCascade = relations.filter((relation) =>
    relation.cascade?.includes("soft-remove" as any)
  )

  // If there are no relations to cascade, just persist the entity and return
  if (!relationsToCascade.length) {
    manager.persist(entity)
    return
  }

  // Fetch the entity with all cascading relations in a single query
  const relationNames = relationsToCascade.map((r) => r.name)

  const query = buildQuery(
    {
      id: entity.id,
    },
    {
      select: [
        "id",
        "deleted_at",
        ...relationNames.flatMap((r) => [`${r}.id`, `${r}.deleted_at`]),
      ],
      relations: relationNames,
      withDeleted: true,
    }
  )

  const entityWithRelations = await manager.findOne(entityName, query.where, {
    ...query.options,
    populateFilter: {
      withDeleted: true,
    },
  } as FindOptions<any>)

  if (!entityWithRelations) {
    manager.persist(entity)
    return
  }

  // Create a map to group related entities by their type
  const relatedEntitiesByType = new Map<
    string,
    T & { id: string; deleted_at?: string | Date | null }[]
  >()

  // Collect all related entities by type
  for (const relation of relationsToCascade) {
    const entityRelation = entityWithRelations[relation.name]

    // Skip if relation is null or undefined
    if (!entityRelation) {
      continue
    }

    const isCollection = "toArray" in entityRelation
    let relationEntities: any[] = []

    if (isCollection) {
      relationEntities = entityRelation.getItems()
    } else {
      relationEntities = [entityRelation]
    }

    if (!relationEntities.length) {
      continue
    }

    // Add to the map of entities by type
    if (!relatedEntitiesByType.has(relation.type)) {
      relatedEntitiesByType.set(relation.type, [] as any)
    }
    relatedEntitiesByType.get(relation.type)!.push(...relationEntities)
  }

  // Process each type of related entity in batch
  const promises: Promise<void>[] = []
  for (const [, entities] of relatedEntitiesByType.entries()) {
    if (entities.length === 0) continue

    // Process cascading relations for these entities
    promises.push(
      ...entities.map((entity) =>
        performCascadingSoftDeletion(
          manager,
          entity as any,
          value,
          softDeletedEntitiesMap
        )
      )
    )
  }

  await promiseAll(promises)

  manager.persist(entity)
}

/**
 * Updates the deleted_at field for all entities in the given array and their
 * cascaded relations and returns a map of entity IDs to their corresponding
 * entity types.
 *
 * @param manager - The Mikro ORM manager instance.
 * @param entities - An array of entities to update.
 * @param value - The value to set for the deleted_at field.
 * @returns A map of entity IDs to their corresponding entity types.
 */
export const mikroOrmUpdateDeletedAtRecursively = async <
  T extends object = any
>(
  manager: SqlEntityManager,
  entities: (T & { id: string; deleted_at?: string | Date | null })[],
  value: Date | null
): Promise<
  Map<string, (T & { id: string; deleted_at?: string | Date | null })[]>
> => {
  const softDeletedEntitiesMap = new Map<
    string,
    (T & { id: string; deleted_at?: string | Date | null })[]
  >()

  if (!entities.length) return softDeletedEntitiesMap

  const entityMetadata = manager
    .getDriver()
    .getMetadata()
    .get(entities[0].constructor.name)
  detectCircularDependency(manager, entityMetadata)

  // Process each entity type
  for (const entity of entities) {
    await performCascadingSoftDeletion(
      manager,
      entity,
      value,
      softDeletedEntitiesMap
    )
  }

  return softDeletedEntitiesMap
}
