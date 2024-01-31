import { buildQuery } from "../../modules-sdk"

export const mikroOrmUpdateDeletedAtRecursively = async <
  T extends object = any
>(
  manager: any,
  entities: (T & { id: string; deleted_at?: string | Date | null })[],
  value: Date | null
) => {
  for (const entity of entities) {
    if (!("deleted_at" in entity)) continue

    entity.deleted_at = value

    const relations = manager
      .getDriver()
      .getMetadata()
      .get(entity.constructor.name).relations

    const relationsToCascade = relations.filter((relation) =>
      relation.cascade.includes("soft-remove" as any)
    )

    for (const relation of relationsToCascade) {
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
          query.options
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
        const initializedEntityRelation = await entityRelation.__helper?.init()
        relationEntities = [initializedEntityRelation]
      }

      await mikroOrmUpdateDeletedAtRecursively(manager, relationEntities, value)
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
