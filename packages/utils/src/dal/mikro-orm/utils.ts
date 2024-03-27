import { buildQuery } from "../../modules-sdk"
import {
  Collection,
  EntityDTO,
  EntityMetadata,
  FindOptions,
  helper,
  IPrimaryKey,
  Loaded,
  Platform,
  Reference,
  ReferenceType,
  SerializationContext,
  Utils,
  wrap,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { SerializeOptions } from "@mikro-orm/core/serialization/EntitySerializer"

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
    relation.cascade.includes("soft-remove" as any)
  )

  for (const relation of relationsToCascade) {
    const branchVisited = new Set(Array.from(visited))

    const isSelfCircularDependency = entityMetadata.class === relation.entity()

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
  value: Date | null
) {
  if (!("deleted_at" in entity)) return

  entity.deleted_at = value

  const entityName = entity.constructor.name

  const relations = manager.getDriver().getMetadata().get(entityName).relations

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
        query.options as FindOptions<any>
      )
    }

    if (!entityRelation) {
      // Fixes the case of many to many through pivot table
      entityRelation = await retrieveEntity()
      if (!entityRelation) {
        continue
      }
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
      const wrappedEntity = wrap(entityRelation)
      const initializedEntityRelation = wrappedEntity.isInitialized()
        ? entityRelation
        : await wrap(entityRelation).init()
      relationEntities = [initializedEntityRelation]
    }

    if (!relationEntities.length) {
      continue
    }

    await mikroOrmUpdateDeletedAtRecursively(manager, relationEntities, value)
  }

  await manager.persist(entity)
}

export const mikroOrmUpdateDeletedAtRecursively = async <
  T extends object = any
>(
  manager: SqlEntityManager,
  entities: (T & { id: string; deleted_at?: string | Date | null })[],
  value: Date | null
) => {
  for (const entity of entities) {
    const entityMetadata = manager
      .getDriver()
      .getMetadata()
      .get(entity.constructor.name)
    detectCircularDependency(manager, entityMetadata)
    await performCascadingSoftDeletion(manager, entity, value)
  }
}

// SERIALIZATION UTILS //

function isVisible<T extends object>(
  meta: EntityMetadata<T>,
  propName: string,
  options: SerializeOptions<T, any>
): boolean {
  if (options.populate === true) {
    return options.populate
  }

  if (
    Array.isArray(options.populate) &&
    options.populate?.find(
      (item) => item === propName || item.startsWith(propName + ".")
    )
  ) {
    return true
  }

  if (options.exclude?.find((item) => item === propName)) {
    return false
  }

  const prop = meta.properties[propName]
  const visible = prop && !prop.hidden
  const prefixed = prop && !prop.primary && propName.startsWith("_") // ignore prefixed properties, if it's not a PK

  return visible && !prefixed
}

function isPopulated<T extends object>(
  entity: T,
  propName: string,
  options: SerializeOptions<T, any>
): boolean {
  if (
    typeof options.populate !== "boolean" &&
    options.populate?.find(
      (item) => item === propName || item.startsWith(propName + ".")
    )
  ) {
    return true
  }

  if (typeof options.populate === "boolean") {
    return options.populate
  }

  return false
}

export class EntitySerializer {
  static serialize<T extends object, P extends string = never>(
    entity: T,
    options: SerializeOptions<T, P> & { preventCircularRef?: boolean } = {},
    parent?: object
  ): EntityDTO<Loaded<T, P>> {
    const wrapped = helper(entity)
    const meta = wrapped.__meta
    let contextCreated = false

    if (!wrapped.__serializationContext.root) {
      const root = new SerializationContext<T>()
      SerializationContext.propagate(
        root,
        entity,
        (meta, prop) =>
          meta.properties[prop]?.reference !== ReferenceType.SCALAR
      )
      contextCreated = true
    }

    const root = wrapped.__serializationContext.root!
    const ret = {} as EntityDTO<Loaded<T, P>>
    const keys = new Set<string>(meta.primaryKeys)
    Object.keys(entity).forEach((prop) => keys.add(prop))
    const visited = root.visited.has(entity)

    if (!visited) {
      root.visited.add(entity)
    }

    ;[...keys]
      .filter((prop) => {
        const isVisibleRes = isVisible<T>(meta, prop, options)
        if (options.preventCircularRef && isVisibleRes && parent) {
          return parent.constructor.name !== meta.properties[prop].type
        }
        return isVisibleRes
      })
      .map((prop) => {
        const cycle = root.visit(meta.className, prop)

        if (cycle && visited) {
          return [prop, undefined]
        }

        const val = this.processProperty<T>(
          prop as keyof T & string,
          entity,
          options,
          parent
        )

        if (!cycle) {
          root.leave(meta.className, prop)
        }

        if (options.skipNull && Utils.isPlainObject(val)) {
          Utils.dropUndefinedProperties(val, null)
        }

        return [prop, val]
      })
      .filter(
        ([, value]) =>
          typeof value !== "undefined" && !(value === null && options.skipNull)
      )
      .forEach(
        ([prop, value]) =>
          (ret[
            this.propertyName(
              meta,
              prop as keyof T & string,
              wrapped.__platform
            )
          ] = value as T[keyof T & string])
      )

    if (contextCreated) {
      root.close()
    }

    if (!wrapped.isInitialized()) {
      return ret
    }

    // decorated getters
    meta.props
      .filter(
        (prop) =>
          prop.getter &&
          prop.getterName === undefined &&
          typeof entity[prop.name] !== "undefined" &&
          isVisible(meta, prop.name, options)
      )
      .forEach(
        (prop) =>
          (ret[this.propertyName(meta, prop.name, wrapped.__platform)] =
            this.processProperty(prop.name, entity, options))
      )

    // decorated get methods
    meta.props
      .filter(
        (prop) =>
          prop.getterName &&
          (entity[prop.getterName] as unknown) instanceof Function &&
          isVisible(meta, prop.name, options)
      )
      .forEach(
        (prop) =>
          (ret[this.propertyName(meta, prop.name, wrapped.__platform)] =
            this.processProperty(
              prop.getterName as keyof T & string,
              entity,
              options
            ))
      )

    return ret
  }

  private static propertyName<T>(
    meta: EntityMetadata<T>,
    prop: keyof T & string,
    platform?: Platform
  ): string {
    /* istanbul ignore next */
    if (meta.properties[prop]?.serializedName) {
      return meta.properties[prop].serializedName as keyof T & string
    }

    if (meta.properties[prop]?.primary && platform) {
      return platform.getSerializedPrimaryKeyField(prop) as keyof T & string
    }

    return prop
  }

  private static processProperty<T extends object>(
    prop: keyof T & string,
    entity: T,
    options: SerializeOptions<T, any>,
    parent?: object
  ): T[keyof T] | undefined {
    const parts = prop.split(".")
    prop = parts[0] as string & keyof T
    const wrapped = helper(entity)
    const property = wrapped.__meta.properties[prop]
    const serializer = property?.serializer

    // getter method
    if ((entity[prop] as unknown) instanceof Function) {
      const returnValue = (
        entity[prop] as unknown as () => T[keyof T & string]
      )()
      if (!options.ignoreSerializers && serializer) {
        return serializer(returnValue)
      }
      return returnValue
    }

    /* istanbul ignore next */
    if (!options.ignoreSerializers && serializer) {
      return serializer(entity[prop])
    }

    if (Utils.isCollection(entity[prop])) {
      return this.processCollection(prop, entity, options, parent)
    }

    if (Utils.isEntity(entity[prop], true)) {
      return this.processEntity(
        prop,
        entity,
        wrapped.__platform,
        options,
        entity
      )
    }

    /* istanbul ignore next */
    if (property?.reference === ReferenceType.EMBEDDED) {
      if (Array.isArray(entity[prop])) {
        return (entity[prop] as object[]).map((item) =>
          helper(item).toJSON()
        ) as T[keyof T]
      }

      if (Utils.isObject(entity[prop])) {
        return helper(entity[prop]).toJSON() as T[keyof T]
      }
    }

    const customType = property?.customType

    if (customType) {
      return customType.toJSON(entity[prop], wrapped.__platform)
    }

    return wrapped.__platform.normalizePrimaryKey(
      entity[prop] as unknown as IPrimaryKey
    ) as unknown as T[keyof T]
  }

  private static extractChildOptions<T extends object, U extends object>(
    options: SerializeOptions<T, any>,
    prop: keyof T & string
  ): SerializeOptions<U, any> {
    const extractChildElements = (items: string[]) => {
      return items
        .filter((field) => field.startsWith(`${prop}.`))
        .map((field) => field.substring(prop.length + 1))
    }

    return {
      ...options,
      populate: Array.isArray(options.populate)
        ? extractChildElements(options.populate)
        : options.populate,
      exclude: Array.isArray(options.exclude)
        ? extractChildElements(options.exclude)
        : options.exclude,
    } as SerializeOptions<U, any>
  }

  private static processEntity<T extends object>(
    prop: keyof T & string,
    entity: T,
    platform: Platform,
    options: SerializeOptions<T, any>,
    parent?: object
  ): T[keyof T] | undefined {
    const child = Reference.unwrapReference(entity[prop] as T)
    const wrapped = helper(child)
    const populated =
      isPopulated(child, prop, options) && wrapped.isInitialized()
    const expand = populated || options.forceObject || !wrapped.__managed

    if (expand) {
      return this.serialize(
        child,
        this.extractChildOptions(options, prop),
        parent
      ) as T[keyof T]
    }

    return platform.normalizePrimaryKey(
      wrapped.getPrimaryKey() as IPrimaryKey
    ) as T[keyof T]
  }

  private static processCollection<T extends object>(
    prop: keyof T & string,
    entity: T,
    options: SerializeOptions<T, any>,
    parent?: object
  ): T[keyof T] | undefined {
    const col = entity[prop] as unknown as Collection<T>

    if (!col.isInitialized()) {
      return undefined
    }

    return col.getItems(false).map((item) => {
      if (isPopulated(item, prop, options)) {
        return this.serialize(
          item,
          this.extractChildOptions(options, prop),
          entity
        )
      }

      return helper(item).getPrimaryKey()
    }) as unknown as T[keyof T]
  }
}

export const mikroOrmSerializer = async <TOutput extends object>(
  data: any,
  options?: Parameters<typeof EntitySerializer.serialize>[1] & {
    preventCircularRef?: boolean
  }
): Promise<TOutput> => {
  options ??= {}

  const data_ = (Array.isArray(data) ? data : [data]).filter(Boolean)

  const forSerialization: unknown[] = []
  const notForSerialization: unknown[] = []

  data_.forEach((object) => {
    if (object.__meta) {
      return forSerialization.push(object)
    }

    return notForSerialization.push(object)
  })

  let result: any = forSerialization.map((entity) =>
    EntitySerializer.serialize(entity, {
      forceObject: true,
      populate: false,
      preventCircularRef: true,
      ...options,
    } as SerializeOptions<any, any>)
  ) as TOutput[]

  if (notForSerialization.length) {
    result = result.concat(notForSerialization)
  }

  return Array.isArray(data) ? result : result[0]
}
