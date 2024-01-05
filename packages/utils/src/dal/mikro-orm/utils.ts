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

      const isCollection = "toArray" in entityRelation
      let relationEntities: any[] = []

      if (isCollection) {
        if (!entityRelation.isInitialized()) {
          entityRelation = await entityRelation.init({ populate: true })
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
  const result = serialize(data, options)
  return result as unknown as Promise<TOutput>
}
