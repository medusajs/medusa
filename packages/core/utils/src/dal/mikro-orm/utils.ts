import {
  EntityMetadata,
  FindOptions,
  wrap,
} from "@medusajs/deps/mikro-orm/core"
import { SqlEntityManager } from "@medusajs/deps/mikro-orm/postgresql"
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

type SoftDeletableEntity = { id: string; deleted_at?: string | Date | null }

// Keeps each cascade lookup well below Postgres' 65,535 bind parameter limit
const CASCADE_LOOKUP_BATCH_SIZE = 1000

function areRelationsLoaded(entity: object, relationNames: string[]): boolean {
  return relationNames.every((name) => {
    const relation = entity[name]

    // A to-one relation known to be empty, nothing to load
    if (relation === null) {
      return true
    }

    if (relation === undefined) {
      return false
    }

    return "toArray" in relation
      ? relation.isInitialized()
      : wrap(relation).isInitialized()
  })
}

/**
 * Marks one level of the cascade tree as deleted and returns the entities of
 * the next level. Cascading relations are loaded with one query per entity
 * type (per batch of ids), rather than one query per entity.
 */
async function performCascadingSoftDeletion<T>(
  manager: SqlEntityManager,
  entities: (T & SoftDeletableEntity)[],
  value: Date | null,
  softDeletedEntitiesMap: Map<string, (T & SoftDeletableEntity)[]>,
  visited: Set<T & SoftDeletableEntity>
): Promise<(T & SoftDeletableEntity)[]> {
  const entitiesByType = new Map<string, (T & SoftDeletableEntity)[]>()

  for (const entity of entities) {
    // An entity can be reached through more than one relation, process it once
    if (visited.has(entity) || !("deleted_at" in entity)) continue
    visited.add(entity)

    entity.deleted_at = value

    const entityName = entity.constructor.name

    const softDeletedEntityMapItem = softDeletedEntitiesMap.get(entityName)
    if (!softDeletedEntityMapItem) {
      softDeletedEntitiesMap.set(entityName, [entity])
    } else {
      softDeletedEntityMapItem.push(entity)
    }

    const entitiesOfType = entitiesByType.get(entityName)
    if (!entitiesOfType) {
      entitiesByType.set(entityName, [entity])
    } else {
      entitiesOfType.push(entity)
    }
  }

  const nextLevel: (T & SoftDeletableEntity)[] = []

  for (const [entityName, entitiesOfType] of entitiesByType) {
    const entityMetadata = manager.getDriver().getMetadata().get(entityName)

    const relationsToCascade = entityMetadata.relations.filter((relation) =>
      relation.cascade?.includes("soft-remove" as any)
    )

    if (relationsToCascade.length) {
      const relationNames = relationsToCascade.map((r) => r.name)

      const entitiesToLoad = entitiesOfType.filter(
        (entity) => !areRelationsLoaded(entity, relationNames)
      )

      // Populate the cascading relations of the whole batch in a single query.
      // The loaded entities are the same instances as the ones in the identity
      // map, so the relations are read from `entitiesOfType` below.
      for (
        let i = 0;
        i < entitiesToLoad.length;
        i += CASCADE_LOOKUP_BATCH_SIZE
      ) {
        const batch = entitiesToLoad.slice(i, i + CASCADE_LOOKUP_BATCH_SIZE)

        const query = buildQuery(
          {
            id: batch.map((entity) => entity.id),
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

        await manager.find(entityName, query.where, {
          ...query.options,
          populateFilter: {
            withDeleted: true,
          },
        } as FindOptions<any>)
      }

      for (const entity of entitiesOfType) {
        for (const relation of relationsToCascade) {
          const entityRelation = entity[relation.name]

          // Skip if relation is null or undefined
          if (!entityRelation) {
            continue
          }

          if ("toArray" in entityRelation) {
            // Not initialized when the entity doesn't exist in the database
            if (entityRelation.isInitialized()) {
              nextLevel.push(...entityRelation.getItems())
            }
          } else {
            nextLevel.push(entityRelation)
          }
        }
      }
    }

    manager.persist(entitiesOfType)
  }

  return nextLevel
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

  // Walk the cascade tree level by level, so each level costs one query per
  // entity type instead of one query per entity
  const visited = new Set<T & SoftDeletableEntity>()
  let level = entities

  while (level.length) {
    level = await performCascadingSoftDeletion(
      manager,
      level,
      value,
      softDeletedEntitiesMap,
      visited
    )
  }

  return softDeletedEntitiesMap
}
