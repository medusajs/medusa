import { buildQuery } from "../../modules-sdk"
import { FindOptions, wrap } from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export const mikroOrmUpdateDeletedAtRecursively = async <
  T extends object = any
>(
  manager: SqlEntityManager,
  entities: (T & { id: string; deleted_at?: string | Date | null })[],
  value: Date | null,
  visited: Map<string, string> = new Map()
) => {
  for (const entity of entities) {
    if (!("deleted_at" in entity)) continue

    entity.deleted_at = value

    const entityName = entity.constructor.name
    const entityMetadata = manager.getDriver().getMetadata().get(entityName)

    visited.set(
      entityMetadata.className,
      entityMetadata.name ?? entityMetadata.className
    )

    const relations = manager
      .getDriver()
      .getMetadata()
      .get(entityName).relations

    const relationsToCascade = relations.filter((relation) =>
      relation.cascade.includes("soft-remove" as any)
    )

    for (const relation of relationsToCascade) {
      if (visited.has(relation.type)) {
        const dependencies = Array.from(visited)
        dependencies.push([relation.type, relation.name])
        const circularDependencyStr = dependencies
          .map(([, value]) => value)
          .join(" -> ")

        throw new Error(
          `Unable to soft delete the ${relation.name}. Circular dependency detected: ${circularDependencyStr}`
        )
      }
      visited.set(relation.type, relation.name.toLowerCase())

      let entityRelation = entity[relation.name]

      // Handle optional relationships
      if (relation.nullable && !entityRelation) {
        continue
      }

      const retrieveEntity = async () => {
        const query = buildQuery(
          {
            id: entity.id,
          },
          {
            relations: [relation.name],
            withDeleted: true,
          }
        )
        return await manager.findOne(
          entity.constructor.name,
          query.where,
          query.options as FindOptions<any>
        )
      }

      if (!entityRelation) {
        // Fixes the case of many to many through pivot table
        entityRelation = await retrieveEntity()
      }

      const isCollection = "toArray" in entityRelation
      let relationEntities: any[] = []

      if (isCollection) {
        if (!entityRelation.isInitialized()) {
          entityRelation = await retrieveEntity()
          entityRelation = entityRelation[relation.name]
        }
        relationEntities = entityRelation.getItems()
      } else {
        const initializedEntityRelation = await wrap(entityRelation)
          .init()
          .catch(() => entityRelation)
        relationEntities = [initializedEntityRelation]
      }

      await mikroOrmUpdateDeletedAtRecursively(
        manager,
        relationEntities,
        value,
        visited
      )
    }

    await manager.persist(entity)
  }
}

export const mikroOrmSerializer = async <TOutput extends object>(
  data: any,
  options?: any
): Promise<TOutput> => {
  options ??= {}
  const { serialize } = await import("@mikro-orm/core")
  const result = serialize(data, {
    forceObject: true,
    populate: true,
    ...options,
  })
  return result as unknown as Promise<TOutput>
}
