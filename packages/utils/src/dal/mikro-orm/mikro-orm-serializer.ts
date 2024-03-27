import {
  Collection,
  EntityDTO,
  EntityMetadata,
  helper,
  IPrimaryKey,
  Loaded,
  Platform,
  Reference,
  ReferenceType,
  SerializationContext,
  Utils,
} from "@mikro-orm/core"
import { SerializeOptions } from "@mikro-orm/core/serialization/EntitySerializer"

function isVisible<T extends object>(
  meta: EntityMetadata<T>,
  propName: string,
  options: SerializeOptions<T, any> & { preventCircularRef?: boolean } = {}
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

/**
 * Customer property filtering for the serialization which takes into account the parent entity to filter out circular references if configured for.
 * @param propName
 * @param meta
 * @param options
 * @param parent
 */
function filterEntityPropToSerialize(
  propName: string,
  meta: EntityMetadata,
  options: SerializeOptions<object, any> & {
    preventCircularRef?: boolean
  } = {},
  parent?: object
): boolean {
  const isVisibleRes = isVisible(meta, propName, options)
  const prop = meta.properties[propName]

  // Only prevent circular references if prop is a relation
  if (
    prop &&
    options.preventCircularRef &&
    isVisibleRes &&
    parent &&
    prop.reference !== ReferenceType.SCALAR
  ) {
    // mapToPk would represent a foreign key and we want to keep them
    return !!prop.mapToPk || parent.constructor.name !== prop.type
  }
  return isVisibleRes
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
      /** Medusa Custom properties filtering **/
      .filter((prop) =>
        filterEntityPropToSerialize(prop, meta, options, parent)
      )
      .map((prop) => {
        const cycle = root.visit(meta.className, prop)

        if (cycle && visited) {
          return [prop, undefined]
        }

        const val = this.processProperty<T>(
          prop as keyof T & string,
          entity,
          options
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
    options: SerializeOptions<T, any>
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
      return this.processCollection(prop, entity, options)
    }

    if (Utils.isEntity(entity[prop], true)) {
      return this.processEntity(prop, entity, wrapped.__platform, options)
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
    options: SerializeOptions<T, any>
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
        /** passing the entity as the parent for circular filtering **/
        entity
      ) as T[keyof T]
    }

    return platform.normalizePrimaryKey(
      wrapped.getPrimaryKey() as IPrimaryKey
    ) as T[keyof T]
  }

  private static processCollection<T extends object>(
    prop: keyof T & string,
    entity: T,
    options: SerializeOptions<T, any>
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
          /** passing the entity as the parent for circular filtering **/
          entity
        )
      }

      return helper(item).getPrimaryKey()
    }) as unknown as T[keyof T]
  }
}

export const mikroOrmSerializer = <TOutput extends object>(
  data: any,
  options?: Parameters<typeof EntitySerializer.serialize>[1] & {
    preventCircularRef?: boolean
  }
): TOutput => {
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
      populate: true,
      preventCircularRef: true,
      ...options,
    } as SerializeOptions<any, any>)
  ) as TOutput[]

  if (notForSerialization.length) {
    result = result.concat(notForSerialization)
  }

  return Array.isArray(data) ? result : result[0]
}
