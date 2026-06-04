import {
  Collection,
  EntityDTO,
  EntityMetadata,
  helper,
  IPrimaryKey,
  Loaded,
  Platform,
  Reference,
  ReferenceKind,
  SerializationContext,
  Utils,
} from "@medusajs/deps/mikro-orm/core"

const STATIC_OPTIONS_SHAPE = {
  populate: true as string[] | boolean,
  exclude: undefined as string[] | undefined,
  preventCircularRef: true as boolean,
  skipNull: undefined as boolean | undefined,
  ignoreSerializers: undefined as boolean | undefined,
  forceObject: true as boolean,
}

const EMPTY_ARRAY: readonly string[] = Object.freeze([])
const WILDCARD = "*"
const DOT = "."
const UNDERSCORE = "_"

function isVisible(
  propName: string,
  populate: string[] | boolean,
  exclude: string[] | undefined,
  meta: EntityMetadata["properties"]
): boolean {
  if (populate === true) return true

  if (exclude && exclude.includes(propName)) return false

  if (Array.isArray(populate)) {
    const populateLength = populate.length
    const propNameLength = propName.length

    for (let i = 0; i < populateLength; i++) {
      const item = populate[i]
      if (item === WILDCARD) return true
      if (item === propName) return true
      if (item.length > propNameLength && item[propNameLength] === DOT) {
        if (item.slice(0, propNameLength) === propName) return true
      }
    }
  }

  const prop = meta[propName]
  const visible = (prop && !prop.hidden) || prop === undefined
  const prefixed = prop && !prop.primary && propName.charAt(0) === UNDERSCORE
  return visible && !prefixed
}

function isPopulated(propName: string, populate: string[] | boolean): boolean {
  if (populate === true) return true
  if (populate === false || !Array.isArray(populate)) return false

  const propNameLength = propName.length
  const populateLength = populate.length

  for (let i = 0; i < populateLength; i++) {
    const item = populate[i]
    if (item === WILDCARD || item === propName) return true
    if (item.length > propNameLength && item[propNameLength] === DOT) {
      if (item.slice(0, propNameLength) === propName) return true
    }
  }

  return false
}

class RequestScopedSerializationContext {
  readonly propertyNameCache = new Map<string, string>()
  readonly visitedEntities = new WeakSet<object>()
  //  The buffer essentially replaces what would otherwise be a Set → Array conversion with a more
  //  efficient pre-allocated array approach, while maintaining the
  //  deduplication logic via the separate seenKeys Set.
  readonly keyCollectionBuffer = new Array<string>(100) // Pre-allocated buffer for key collection
  keyBufferIndex = 0

  constructor() {
    this.propertyNameCache.set("id", "id")
    this.propertyNameCache.set("created_at", "created_at")
    this.propertyNameCache.set("updated_at", "updated_at")
    this.propertyNameCache.set("deleted_at", "deleted_at")
  }

  resetKeyBuffer(): void {
    this.keyBufferIndex = 0
  }

  addKey(key: string): void {
    if (this.keyBufferIndex < this.keyCollectionBuffer.length) {
      this.keyCollectionBuffer[this.keyBufferIndex++] = key
    } else {
      this.keyCollectionBuffer.push(key)
      this.keyBufferIndex++
    }
  }

  getKeys(): string[] {
    // Avoid slice allocation if buffer is exactly full
    if (this.keyBufferIndex === this.keyCollectionBuffer.length) {
      return this.keyCollectionBuffer
    }
    return this.keyCollectionBuffer.slice(0, this.keyBufferIndex)
  }
}

export class EntitySerializer {
  static serialize<T extends object, P extends string = never>(
    entity: T,
    options: Partial<typeof STATIC_OPTIONS_SHAPE> = STATIC_OPTIONS_SHAPE,
    parents: readonly string[] = EMPTY_ARRAY,
    requestCtx?: RequestScopedSerializationContext
  ): EntityDTO<Loaded<T, P>> {
    const ctx = requestCtx ?? new RequestScopedSerializationContext()
    const wrapped = helper(entity)
    const meta = wrapped.__meta
    let contextCreated = false

    const populate = options.populate ?? STATIC_OPTIONS_SHAPE.populate
    const exclude = options.exclude
    const skipNull = options.skipNull ?? STATIC_OPTIONS_SHAPE.skipNull
    const preventCircularRef =
      options.preventCircularRef ?? STATIC_OPTIONS_SHAPE.preventCircularRef
    const ignoreSerializers =
      options.ignoreSerializers ?? STATIC_OPTIONS_SHAPE.ignoreSerializers
    const forceObject = options.forceObject ?? STATIC_OPTIONS_SHAPE.forceObject

    const serializationContext = wrapped.__serializationContext
    if (!serializationContext.root) {
      const root = new SerializationContext({} as any)
      SerializationContext.propagate(
        root,
        entity,
        (meta: any, prop: any) =>
          meta.properties[prop]?.kind !== ReferenceKind.SCALAR
      )
      contextCreated = true
    }

    const root = serializationContext.root! as SerializationContext<any>
    const ret = {} as EntityDTO<Loaded<T, P>>

    ctx.resetKeyBuffer()
    const seenKeys = new Set<string>()

    const primaryKeys = meta.primaryKeys
    const primaryKeysLength = primaryKeys.length
    const entityKeys = Object.keys(entity)
    const entityKeysLength = entityKeys.length
    const metaPropertyKeys = Object.keys(meta.properties)
    const metaPropertyKeysLength = metaPropertyKeys.length

    for (let i = 0; i < primaryKeysLength; i++) {
      const key = primaryKeys[i]
      if (!seenKeys.has(key)) {
        seenKeys.add(key)
        ctx.addKey(key)
      }
    }

    for (let i = 0; i < entityKeysLength; i++) {
      const key = entityKeys[i]
      if (!seenKeys.has(key)) {
        seenKeys.add(key)
        ctx.addKey(key)
      }
    }

    for (let i = 0; i < metaPropertyKeysLength; i++) {
      const key = metaPropertyKeys[i]
      if (!seenKeys.has(key)) {
        seenKeys.add(key)
        ctx.addKey(key)
      }
    }

    const allKeys = ctx.getKeys()
    const allKeysLength = allKeys.length

    let hasComplexProperties = false
    const metaProperties = meta.properties
    for (let i = 0; i < allKeysLength; i++) {
      const prop = allKeys[i]
      const propMeta = metaProperties[prop]
      if (propMeta && propMeta.kind !== ReferenceKind.SCALAR) {
        hasComplexProperties = true
        break
      }
    }

    if (!hasComplexProperties && populate === true) {
      for (let i = 0; i < allKeysLength; i++) {
        const prop = allKeys[i]
        const propValue = entity[prop as keyof T]
        if (propValue !== undefined && !(propValue === null && skipNull)) {
          ret[prop] = propValue as T[keyof T & string]
        }
      }
      if (contextCreated) root.close()
      return ret
    }

    const visited = root.visited.has(entity)
    if (!visited) root.visited.add(entity)

    const className = meta.className
    const platform = wrapped.__platform

    for (let i = 0; i < allKeysLength; i++) {
      const prop = allKeys[i]

      const isPropertyVisible = isVisible(
        prop,
        populate,
        exclude,
        metaProperties
      )

      if (!isPropertyVisible) continue

      const propMeta = metaProperties[prop]
      let shouldSerialize = true

      if (
        propMeta &&
        preventCircularRef &&
        propMeta.kind !== ReferenceKind.SCALAR
      ) {
        if (!propMeta.mapToPk) {
          const propType = propMeta.type
          const parentsLength = parents.length
          for (let j = 0; j < parentsLength; j++) {
            if (parents[j] === propType) {
              shouldSerialize = false
              break
            }
          }
        }
      }

      if (!shouldSerialize) continue

      const cycle = root.visit(className, prop)
      if (cycle && visited) continue

      const val = this.processProperty<T>(
        prop as keyof T & string,
        entity,
        populate,
        exclude,
        skipNull,
        preventCircularRef,
        ignoreSerializers,
        forceObject,
        parents,
        ctx
      )

      if (!cycle) root.leave(className, prop)

      if (val !== undefined && !(val === null && skipNull)) {
        let propName: string
        if (propMeta?.serializedName) {
          propName = propMeta.serializedName as string
        } else if (propMeta?.primary && platform) {
          propName = platform.getSerializedPrimaryKeyField(prop) as string
        } else {
          propName = prop
        }

        ret[propName] = val as T[keyof T & string]
      }
    }

    if (contextCreated) root.close()

    if (!wrapped.isInitialized()) return ret

    const metaProps = meta.props
    const metaPropsLength = metaProps.length

    for (let i = 0; i < metaPropsLength; i++) {
      const prop = metaProps[i]
      const propName = prop.name

      if (!isVisible(propName, populate, exclude, meta.properties)) continue

      let propertyKey: keyof T & string
      let shouldProcess = false

      if (prop.getter && !prop.getterName && entity[propName] !== undefined) {
        propertyKey = propName
        shouldProcess = true
      } else if (
        prop.getterName &&
        typeof entity[prop.getterName] === "function"
      ) {
        propertyKey = prop.getterName as keyof T & string
        shouldProcess = true
      }

      if (shouldProcess) {
        ret[this.propertyName(meta, propName, platform, ctx)] =
          this.processProperty(
            propertyKey!,
            entity,
            populate,
            exclude,
            skipNull,
            preventCircularRef,
            ignoreSerializers,
            forceObject,
            parents,
            ctx
          )
      }
    }

    return ret
  }

  private static propertyName<T>(
    meta: EntityMetadata<T>,
    prop: string,
    platform: Platform,
    ctx: RequestScopedSerializationContext
  ): string {
    const cacheKey = `${meta.className}:${prop}:${
      platform?.constructor.name || "none"
    }`

    const cached = ctx.propertyNameCache.get(cacheKey)
    if (cached !== undefined) return cached

    const property = meta.properties[prop]
    let result: string

    if (property?.serializedName) {
      result = property.serializedName as string
    } else if (property?.primary && platform) {
      result = platform.getSerializedPrimaryKeyField(prop) as string
    } else {
      result = prop
    }

    ctx.propertyNameCache.set(cacheKey, result)
    return result
  }

  private static processProperty<T extends object>(
    prop: string,
    entity: T,
    populate: string[] | boolean,
    exclude: string[] | undefined,
    skipNull: boolean | undefined,
    preventCircularRef: boolean,
    ignoreSerializers: boolean | undefined,
    forceObject: boolean,
    parents: readonly string[],
    ctx: RequestScopedSerializationContext
  ): T[keyof T] | undefined {
    const entityConstructorName = entity.constructor.name
    const newParents =
      parents.length > 0
        ? [...parents, entityConstructorName]
        : [entityConstructorName]

    const dotIndex = prop.indexOf(DOT)
    if (dotIndex > 0) {
      prop = prop.substring(0, dotIndex)
    }

    const wrapped = helper(entity)
    const property = wrapped.__meta.properties[prop]
    const propValue = entity[prop as keyof T]

    if (typeof propValue === "function") {
      const returnValue = (propValue as any)()
      if (!ignoreSerializers && property?.serializer) {
        return property.serializer(returnValue)
      }
      return returnValue
    }

    if (!ignoreSerializers && property?.serializer) {
      return property.serializer(propValue)
    }

    if (Utils.isCollection(propValue)) {
      return this.processCollection(
        prop as keyof T & string,
        entity,
        populate,
        exclude,
        skipNull,
        preventCircularRef,
        ignoreSerializers,
        forceObject,
        newParents,
        ctx
      )
    }

    if (Utils.isEntity(propValue, true)) {
      return this.processEntity(
        prop as keyof T & string,
        entity,
        wrapped.__platform,
        populate,
        exclude,
        skipNull,
        preventCircularRef,
        ignoreSerializers,
        forceObject,
        newParents,
        ctx
      )
    }

    if (property?.kind === ReferenceKind.EMBEDDED) {
      if (Array.isArray(propValue)) {
        const result = new Array(propValue.length)
        for (let i = 0; i < propValue.length; i++) {
          result[i] = helper(propValue[i]).toJSON()
        }
        return result as T[keyof T]
      }
      if (Utils.isObject(propValue)) {
        return helper(propValue).toJSON() as T[keyof T]
      }
    }

    if (property?.customType) {
      return property.customType.toJSON(propValue, wrapped.__platform)
    }

    /**
     * Live entities can end up in plain arrays instead of collections, either
     * assigned to a property that is not part of the entity metadata, or
     * overwriting a declared relation's Collection (e.g. the product module
     * computes ProductVariant.images at runtime and assigns it as an array).
     * Such arrays match none of the relation branches above, so without this
     * check they would fall through to the primary key normalization below
     * and leak live ORM entities into the serialized output.
     */
    if (Array.isArray(propValue)) {
      let hasEntities = false
      for (let i = 0; i < propValue.length; i++) {
        if (Utils.isEntity(propValue[i], true)) {
          hasEntities = true
          break
        }
      }

      if (hasEntities) {
        const childOptions = this.createChildOptions(
          populate,
          exclude,
          skipNull,
          preventCircularRef,
          ignoreSerializers,
          forceObject,
          prop
        )

        const result = new Array(propValue.length)
        for (let i = 0; i < propValue.length; i++) {
          const item = propValue[i]
          result[i] = Utils.isEntity(item, true)
            ? this.serialize(item, childOptions, newParents, ctx)
            : item
        }
        return result as T[keyof T]
      }
    }

    return wrapped.__platform.normalizePrimaryKey(
      propValue as unknown as IPrimaryKey
    ) as unknown as T[keyof T]
  }

  private static extractChildPopulate(
    populate: string[] | boolean,
    prop: string
  ): string[] | boolean {
    if (!Array.isArray(populate) || populate.includes(WILDCARD)) {
      return populate
    }

    const propPrefix = prop + DOT
    const propPrefixLength = propPrefix.length
    const childPopulate: string[] = []

    const populateLength = populate.length
    for (let i = 0; i < populateLength; i++) {
      const field = populate[i]
      if (
        field.length > propPrefixLength &&
        field.slice(0, propPrefixLength) === propPrefix
      ) {
        childPopulate.push(field.substring(propPrefixLength))
      }
    }

    return childPopulate.length > 0 ? childPopulate : false
  }

  private static createChildOptions(
    populate: string[] | boolean,
    exclude: string[] | undefined,
    skipNull: boolean | undefined,
    preventCircularRef: boolean | undefined,
    ignoreSerializers: boolean | undefined,
    forceObject: boolean,
    prop: string
  ) {
    const childPopulate = this.extractChildPopulate(populate, prop)
    return {
      populate: childPopulate,
      exclude,
      preventCircularRef,
      skipNull,
      ignoreSerializers,
      forceObject,
    }
  }

  private static processEntity<T extends object>(
    prop: keyof T & string,
    entity: T,
    platform: Platform,
    populate: string[] | boolean,
    exclude: string[] | undefined,
    skipNull: boolean | undefined,
    preventCircularRef: boolean,
    ignoreSerializers: boolean | undefined,
    forceObject: boolean,
    parents: readonly string[],
    ctx: RequestScopedSerializationContext
  ): T[keyof T] | undefined {
    const child = Reference.unwrapReference(entity[prop] as T)
    const wrapped = helper(child)

    const populated = isPopulated(prop, populate) && wrapped.isInitialized()
    const expand = populated || forceObject || !wrapped.__managed

    if (expand) {
      const childOptions = this.createChildOptions(
        populate,
        exclude,
        skipNull,
        preventCircularRef,
        ignoreSerializers,
        forceObject,
        prop
      )
      return this.serialize(child, childOptions, parents, ctx) as T[keyof T]
    }

    return platform.normalizePrimaryKey(
      wrapped.getPrimaryKey() as IPrimaryKey
    ) as T[keyof T]
  }

  private static processCollection<T extends object>(
    prop: keyof T & string,
    entity: T,
    populate: string[] | boolean,
    exclude: string[] | undefined,
    skipNull: boolean | undefined,
    preventCircularRef: boolean | undefined,
    ignoreSerializers: boolean | undefined,
    forceObject: boolean,
    parents: readonly string[],
    ctx: RequestScopedSerializationContext
  ): T[keyof T] | undefined {
    const col = entity[prop] as unknown as Collection<T>

    if (!col.isInitialized()) return undefined

    const items = col.getItems(false)
    const itemsLength = items.length

    if (itemsLength === 0) return [] as unknown as T[keyof T]

    const result = new Array(itemsLength)

    let shouldPopulateCollection = false
    if (populate === true) {
      shouldPopulateCollection = true
    } else if (Array.isArray(populate)) {
      const propLength = prop.length
      const populateLength = populate.length
      for (let j = 0; j < populateLength; j++) {
        const item = populate[j]
        if (item === WILDCARD || item === prop) {
          shouldPopulateCollection = true
          break
        }
        if (item.length > propLength && item[propLength] === DOT) {
          if (item.slice(0, propLength) === prop) {
            shouldPopulateCollection = true
            break
          }
        }
      }
    }

    if (!shouldPopulateCollection) {
      for (let i = 0; i < itemsLength; i++) {
        const item = items[i]
        const wrapped = helper(item)
        result[i] = wrapped.getPrimaryKey()
      }
      return result as unknown as T[keyof T]
    }

    let childPopulate: string[] | boolean = populate
    if (Array.isArray(populate) && !populate.includes(WILDCARD)) {
      const propPrefix = prop + DOT
      const propPrefixLength = propPrefix.length
      const childPopulateArray: string[] = []

      for (let j = 0; j < populate.length; j++) {
        const field = populate[j]
        if (
          field.length > propPrefixLength &&
          field.slice(0, propPrefixLength) === propPrefix
        ) {
          childPopulateArray.push(field.substring(propPrefixLength))
        }
      }
      childPopulate = childPopulateArray.length > 0 ? childPopulateArray : false
    }

    const childOptions = {
      populate: childPopulate,
      exclude,
      preventCircularRef,
      skipNull,
      ignoreSerializers,
      forceObject,
    }

    for (let i = 0; i < itemsLength; i++) {
      result[i] = this.serialize(items[i], childOptions, parents, ctx)
    }

    return result as unknown as T[keyof T]
  }
}

export const mikroOrmSerializer = <TOutput extends object>(
  data: any,
  options?: Partial<
    Parameters<typeof EntitySerializer.serialize>[1] & {
      preventCircularRef: boolean | undefined
      populate: string[] | boolean | undefined
    }
  >
): TOutput => {
  const ctx = new RequestScopedSerializationContext()

  const finalOptions = options
    ? {
        populate:
          Array.isArray(options.populate) &&
          options.populate?.includes(WILDCARD)
            ? true
            : options.populate ?? STATIC_OPTIONS_SHAPE.populate,
        exclude: options.exclude,
        preventCircularRef:
          options.preventCircularRef ?? STATIC_OPTIONS_SHAPE.preventCircularRef,
        skipNull: options.skipNull ?? STATIC_OPTIONS_SHAPE.skipNull,
        ignoreSerializers:
          options.ignoreSerializers ?? STATIC_OPTIONS_SHAPE.ignoreSerializers,
        forceObject: options.forceObject ?? STATIC_OPTIONS_SHAPE.forceObject,
      }
    : STATIC_OPTIONS_SHAPE

  if (!Array.isArray(data)) {
    if (data?.__meta) {
      return EntitySerializer.serialize(
        data,
        finalOptions,
        EMPTY_ARRAY,
        ctx
      ) as TOutput
    }
    return data as TOutput
  }

  const dataLength = data.length
  if (dataLength === 0) {
    return [] as unknown as TOutput
  }

  const result = new Array(dataLength)

  for (let i = 0; i < dataLength; i++) {
    const item = data[i]
    if (item?.__meta) {
      result[i] = EntitySerializer.serialize(
        item,
        finalOptions,
        EMPTY_ARRAY,
        ctx
      )
    } else {
      result[i] = item
    }
  }

  return result as TOutput
}
