import {
  ComputedJoinerRelationship,
  ExecutionStage,
  InternalJoinerServiceConfig,
  JoinerRelationship,
  JoinerServiceConfigAlias,
  ModuleJoinerConfig,
  RemoteExpandProperty,
  RemoteJoinerOptions,
  RemoteJoinerQuery,
  RemoteNestedExpands,
} from "@medusajs/types"
import {
  deduplicate,
  FilterOperatorMap,
  GraphQLUtils,
  isDefined,
  isObject,
  isString,
  MedusaError,
} from "@medusajs/utils"

const BASE_PATH = "_root"

export type RemoteFetchDataCallback = (
  expand: RemoteExpandProperty,
  keyField: string,
  ids?: (unknown | unknown[])[],
  relationship?: any
) => Promise<{
  data: unknown[] | { [path: string]: unknown }
  path?: string
}>

type InternalImplodeMapping = {
  location: string[]
  property: string
  path: string[]
  isList?: boolean
}

type InternalParseExpandsParams = {
  initialService: RemoteExpandProperty
  query: RemoteJoinerQuery
  serviceConfig: InternalJoinerServiceConfig
  expands: RemoteJoinerQuery["expands"]
  implodeMapping: InternalImplodeMapping[]
  options?: RemoteJoinerOptions
  initialData?: any[]
  initialDataOnly?: boolean
}

export class RemoteJoiner {
  private serviceConfigCache: Map<string, InternalJoinerServiceConfig> =
    new Map()

  private entityMap: Map<string, Map<string, string>> = new Map()

  private static filterFields(
    data: any,
    fields?: string[],
    expands?: RemoteNestedExpands
  ): Record<string, unknown> | undefined {
    if (!fields || !data) {
      return data
    }

    let filteredData: Record<string, unknown> = {}

    if (fields.includes("*")) {
      // select all fields
      filteredData = data
    } else {
      filteredData = fields.reduce((acc: any, field: string) => {
        const fieldValue = data?.[field]

        if (isDefined(fieldValue)) {
          acc[field] = data?.[field]
        }

        return acc
      }, {})
    }

    if (expands) {
      for (const key of Object.keys(expands ?? {})) {
        const expand = expands[key]
        if (expand) {
          if (Array.isArray(data[key])) {
            filteredData[key] = data[key].map((item: any) =>
              RemoteJoiner.filterFields(item, expand.fields, expand.expands)
            )
          } else {
            const filteredFields = RemoteJoiner.filterFields(
              data[key],
              expand.fields,
              expand.expands
            )

            if (isDefined(filteredFields)) {
              filteredData[key] = RemoteJoiner.filterFields(
                data[key],
                expand.fields,
                expand.expands
              )
            }
          }
        }
      }
    }

    return (Object.keys(filteredData).length && filteredData) || undefined
  }

  private static getNestedItems(items: any[], property: string): any[] {
    const result: unknown[] = []
    for (const item of items) {
      const allValues = item?.[property] ?? []
      const values = Array.isArray(allValues) ? allValues : [allValues]
      for (const value of values) {
        if (isDefined(value)) {
          result.push(value)
        }
      }
    }

    return result
  }

  private static createRelatedDataMap(
    relatedDataArray: any[],
    joinFields: string[]
  ): Map<string, any> {
    return relatedDataArray.reduce((acc, data) => {
      const joinValues = joinFields.map((field) => data[field])
      const key = joinValues.length === 1 ? joinValues[0] : joinValues.join(",")

      let isArray = Array.isArray(acc[key])
      if (isDefined(acc[key]) && !isArray) {
        acc[key] = [acc[key]]
        isArray = true
      }

      if (isArray) {
        acc[key].push(data)
      } else {
        acc[key] = data
      }
      return acc
    }, {})
  }

  // compute ids to fetch for a relationship
  private computeIdsForRelationship(
    items: any[],
    relationship: ComputedJoinerRelationship
  ) {
    const field = relationship.inverse
      ? relationship.primaryKey
      : relationship.foreignKey.split(".").pop()!

    const fieldsArray = relationship.inverse
      ? relationship.primaryKeyArr
      : relationship.foreignKeyArr

    const idsToFetch: Set<any> = new Set()
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item) {
        continue
      }
      const values = fieldsArray.map((f) => item?.[f])
      if (values.length !== fieldsArray.length) {
        continue
      }

      if (fieldsArray.length === 1) {
        const val = values[0]
        if (Array.isArray(val)) {
          for (let x = 0; x < val.length; x++) {
            idsToFetch.add(val[x])
          }
        } else {
          idsToFetch.add(val)
        }
      } else {
        idsToFetch.add(values)
      }
    }

    return { field, fieldsArray, idsToFetch }
  }

  // assign fetched related data to items
  private assignRelatedToItems(params: {
    items: any[]
    relationship: ComputedJoinerRelationship
    relatedDataMap: Map<string, any>
    field: string
    fieldsArray: string[]
  }) {
    const { items, relationship, relatedDataMap, field, fieldsArray } = params

    items.forEach((item) => {
      if (!item) {
        return
      }

      const itemKey = fieldsArray.map((f) => item[f]).join(",")

      if (item[relationship.alias]) {
        if (Array.isArray(item[field])) {
          for (let i = 0; i < item[relationship.alias].length; i++) {
            const it = item[relationship.alias][i]
            item[relationship.alias][i] = Object.assign(
              it,
              relatedDataMap[it[relationship.primaryKey]]
            )
          }
          return
        }

        item[relationship.alias] = Object.assign(
          item[relationship.alias],
          relatedDataMap[itemKey]
        )
        return
      }

      if (Array.isArray(item[field])) {
        item[relationship.alias] = item[field].map((id) => {
          if (relationship.isList && !Array.isArray(relatedDataMap[id])) {
            relatedDataMap[id] = isDefined(relatedDataMap[id])
              ? [relatedDataMap[id]]
              : []
          }

          return relatedDataMap[id]
        })
      } else {
        if (relationship.isList && !Array.isArray(relatedDataMap[itemKey])) {
          relatedDataMap[itemKey] = isDefined(relatedDataMap[itemKey])
            ? [relatedDataMap[itemKey]]
            : []
        }

        item[relationship.alias] = relatedDataMap[itemKey]
      }
    })
  }

  static parseQuery(
    graphqlQuery: string,
    variables?: Record<string, unknown>
  ): RemoteJoinerQuery {
    const parser = new GraphQLUtils.GraphQLParser(graphqlQuery, variables)
    return parser.parseQuery()
  }

  constructor(
    serviceConfigs: ModuleJoinerConfig[],
    private remoteFetchData: RemoteFetchDataCallback,
    private options: {
      autoCreateServiceNameAlias?: boolean
      entitiesMap?: Map<string, any>
    } = {}
  ) {
    this.options.autoCreateServiceNameAlias ??= true
    if (this.options.entitiesMap) {
      this.entityMap = GraphQLUtils.extractRelationsFromGQL(
        this.options.entitiesMap
      )
    }

    this.buildReferences(
      JSON.parse(JSON.stringify(serviceConfigs), (key, value) => {
        if (key === "schema") {
          return
        }
        return value
      })
    )
  }

  public setFetchDataCallback(remoteFetchData: RemoteFetchDataCallback): void {
    this.remoteFetchData = remoteFetchData
  }

  private buildReferences(serviceConfigs: ModuleJoinerConfig[]) {
    const expandedRelationships: Map<
      string,
      {
        fieldAlias
        relationships: Map<string, JoinerRelationship | JoinerRelationship[]>
      }
    > = new Map()

    for (const service of serviceConfigs) {
      const service_ = service as Omit<ModuleJoinerConfig, "relationships"> & {
        relationships?: Map<string, JoinerRelationship | JoinerRelationship[]>
      }

      if (this.serviceConfigCache.has(service_.serviceName!)) {
        throw new Error(`Service "${service_.serviceName}" is already defined.`)
      }

      service_.fieldAlias ??= {}
      service_.extends ??= []
      service_.relationships ??= new Map()

      if (Array.isArray(service_.relationships)) {
        const relationships = new Map()
        for (const relationship of service_.relationships) {
          relationships.set(relationship.alias, relationship)
        }
        service_.relationships = relationships
      }

      // Precompute key arrays for all existing relationships on the service
      if (service_.relationships?.size) {
        for (const [, relVal] of service_.relationships.entries()) {
          if (Array.isArray(relVal)) {
            for (let i = 0; i < relVal.length; i++) {
              const rel = relVal[i] as ComputedJoinerRelationship
              rel.primaryKeyArr = rel.primaryKey.split(",")
              rel.foreignKeyArr = rel.foreignKey
                .split(",")
                .map((fk) => fk.split(".").pop()!)
            }
          } else if (relVal) {
            const rel = relVal as ComputedJoinerRelationship
            rel.primaryKeyArr = rel.primaryKey.split(",")
            rel.foreignKeyArr = rel.foreignKey
              .split(",")
              .map((fk) => fk.split(".").pop()!)
          }
        }
      }

      // add aliases
      const isReadOnlyDefinition =
        !isDefined(service_.serviceName) || service_.isReadOnlyLink
      if (!isReadOnlyDefinition) {
        service_.alias ??= []

        if (!Array.isArray(service_.alias)) {
          service_.alias = [service_.alias]
        }

        if (this.options.autoCreateServiceNameAlias) {
          service_.alias.push({ name: service_.serviceName! })
        }

        // handle alias.name as array
        for (let idx = 0; idx < service_.alias.length; idx++) {
          const alias = service_.alias[idx]
          if (!Array.isArray(alias.name)) {
            continue
          }

          for (const name of alias.name) {
            service_.alias.push({
              name,
              entity: alias.entity,
              args: alias.args,
            })
          }
          service_.alias.splice(idx, 1)
          idx--
        }

        // self-reference
        for (const alias of service_.alias) {
          if (this.serviceConfigCache.has(`alias_${alias.name}`)) {
            const defined = this.serviceConfigCache.get(`alias_${alias.name}`)

            if (service_.serviceName === defined?.serviceName) {
              continue
            }

            throw new Error(
              `Cannot add alias "${alias.name}" for "${service_.serviceName}". It is already defined for Service "${defined?.serviceName}".`
            )
          }

          const args =
            service_.args || alias.args
              ? { ...service_.args, ...alias.args }
              : undefined

          const aliasName = alias.name as string
          const rel = {
            alias: aliasName,
            entity: alias.entity,
            foreignKey: alias.name + "_id",
            primaryKey: "id",
            serviceName: service_.serviceName!,
            args,
          }

          if (service_.relationships?.has(aliasName)) {
            const existing = service_.relationships.get(aliasName)!
            const newRelation = Array.isArray(existing)
              ? existing.concat(rel)
              : [existing, rel]

            service_.relationships?.set(aliasName, newRelation)
          } else {
            service_.relationships?.set(aliasName, rel)
          }

          this.cacheServiceConfig(serviceConfigs, { serviceAlias: alias })
        }

        this.cacheServiceConfig(serviceConfigs, {
          serviceName: service_.serviceName,
        })
      }

      for (const extend of service_.extends) {
        if (!expandedRelationships.has(extend.serviceName)) {
          expandedRelationships.set(extend.serviceName, {
            fieldAlias: {},
            relationships: new Map(),
          })
        }

        const service_ = expandedRelationships.get(extend.serviceName)!

        const aliasName = extend.relationship.alias
        const rel = extend.relationship as ComputedJoinerRelationship

        rel.primaryKeyArr = rel.primaryKey.split(",")
        rel.foreignKeyArr = rel.foreignKey
          .split(",")
          .map((fk) => fk.split(".").pop()!)

        if (service_.relationships?.has(aliasName)) {
          const existing = service_.relationships.get(aliasName)!
          const newRelation = Array.isArray(existing)
            ? existing.concat(rel)
            : [existing, rel]

          service_.relationships?.set(aliasName, newRelation)
        } else {
          service_.relationships?.set(aliasName, rel)
        }

        // Multiple "fieldAlias" w/ same name need the entity to handle different paths
        this.mergeFieldAlias(service_, extend)
      }
    }

    for (const [
      serviceName,
      { fieldAlias, relationships },
    ] of expandedRelationships) {
      if (!this.serviceConfigCache.has(serviceName)) {
        throw new Error(`Service "${serviceName}" was not found`)
      }

      const service_ = this.serviceConfigCache.get(serviceName)!
      relationships.forEach((relationship, alias) => {
        const rel = relationship as ComputedJoinerRelationship
        if (service_.relationships?.has(alias)) {
          const existing = service_.relationships.get(alias)!
          const newRelation = Array.isArray(existing)
            ? existing.concat(rel)
            : [existing, rel]

          service_.relationships?.set(alias, newRelation)
        } else {
          service_.relationships?.set(alias, rel)
        }
      })

      Object.assign(service_.fieldAlias!, fieldAlias ?? {})

      if (Object.keys(service_.fieldAlias!).length) {
        const conflictAliases = Array.from(
          service_.relationships!.keys()
        ).filter((alias) => fieldAlias[alias as string])

        if (conflictAliases.length) {
          throw new Error(
            `Conflict configuration for service "${serviceName}". The following aliases are already defined as relationships: ${conflictAliases.join(
              ", "
            )}`
          )
        }
      }
    }

    return serviceConfigs
  }

  private mergeFieldAlias(service_, extend) {
    for (const [alias, fieldAlias] of Object.entries(extend.fieldAlias ?? {})) {
      const objAlias = isString(fieldAlias)
        ? { path: fieldAlias }
        : (fieldAlias as object)

      if (service_.fieldAlias[alias]) {
        if (!Array.isArray(service_.fieldAlias[alias])) {
          service_.fieldAlias[alias] = [service_.fieldAlias[alias]]
        }

        if (
          service_.fieldAlias[alias].some((f) => f.entity === extend.entity)
        ) {
          throw new Error(
            `Cannot add alias "${alias}" for "${extend.serviceName}". It is already defined for Entity "${extend.entity}".`
          )
        }

        service_.fieldAlias[alias].push({
          ...objAlias,
          entity: extend.entity,
        })
      } else {
        service_.fieldAlias[alias] = {
          ...objAlias,
          entity: extend.entity,
        }
      }
    }
  }

  private getServiceConfig({
    serviceName,
    serviceAlias,
    entity,
  }: {
    serviceName?: string
    serviceAlias?: string
    entity?: string
  }): InternalJoinerServiceConfig | undefined {
    if (entity) {
      const name = `entity_${entity}`
      const serviceConfig = this.serviceConfigCache.get(name)
      if (serviceConfig) {
        return serviceConfig
      }
    }

    if (serviceAlias) {
      const name = `alias_${serviceAlias}`
      return this.serviceConfigCache.get(name)
    }

    return this.serviceConfigCache.get(serviceName!)
  }

  private cacheServiceConfig(
    serviceConfigs: ModuleJoinerConfig[],
    params: {
      serviceName?: string
      serviceAlias?: JoinerServiceConfigAlias
    }
  ): void {
    const { serviceName, serviceAlias } = params

    if (serviceAlias) {
      const name = `alias_${serviceAlias.name}`
      if (!this.serviceConfigCache.has(name)) {
        let aliasConfig: JoinerServiceConfigAlias | undefined
        const config = serviceConfigs.find((conf) => {
          const aliases = conf.alias as JoinerServiceConfigAlias[]
          const hasArgs = aliases?.find(
            (alias) => alias.name === serviceAlias.name
          )
          aliasConfig = hasArgs
          return hasArgs
        })

        if (config) {
          const serviceConfig = { ...config, entity: serviceAlias.entity }
          if (aliasConfig) {
            serviceConfig.args = { ...config?.args, ...aliasConfig?.args }
          }
          this.serviceConfigCache.set(
            name,
            serviceConfig as InternalJoinerServiceConfig
          )

          const entity = serviceAlias.entity
          if (entity) {
            const name = `entity_${entity}`
            this.serviceConfigCache.set(
              name,
              serviceConfig as InternalJoinerServiceConfig
            )
          }
        }
      }
      return
    }

    const config = serviceConfigs.find(
      (config) => config.serviceName === serviceName
    ) as InternalJoinerServiceConfig
    this.serviceConfigCache.set(serviceName!, config)
  }

  private async fetchData(params: {
    expand: RemoteExpandProperty
    pkField: string
    ids?: (unknown | unknown[])[]
    relationship?: any
    options?: RemoteJoinerOptions
  }): Promise<{
    data: unknown[] | { [path: string]: unknown }
    path?: string
  }> {
    const { expand, pkField, ids, relationship, options } = params

    let uniqueIds: unknown[] | undefined
    if (ids != null) {
      const isIdsUsingOperatorMap =
        isObject(ids) &&
        Object.keys(ids).some((key) => !!FilterOperatorMap[key])
      uniqueIds = isIdsUsingOperatorMap ? ids : Array.isArray(ids) ? ids : [ids]
      uniqueIds = Array.isArray(uniqueIds)
        ? uniqueIds.filter((id) => id != null)
        : uniqueIds
    }

    if (uniqueIds && Array.isArray(uniqueIds)) {
      const isCompositeKey = Array.isArray(uniqueIds[0])
      if (isCompositeKey) {
        const seen = new Set()
        uniqueIds = uniqueIds.filter((idArray) => {
          const key = JSON.stringify(idArray)
          const isNew = !seen.has(key)
          seen.add(key)
          return isNew
        })
      } else {
        uniqueIds = Array.from(new Set(uniqueIds.flat()))
      }
    }

    let pkFieldAdjusted = pkField
    if (relationship) {
      pkFieldAdjusted = relationship.inverse
        ? relationship.foreignKey.split(".").pop()!
        : relationship.primaryKey
    }

    const response = await this.remoteFetchData(
      expand,
      pkFieldAdjusted,
      uniqueIds,
      relationship
    )

    const isObj = isDefined(response.path)
    let resData = isObj ? response.data[response.path!] : response.data

    resData = isDefined(resData)
      ? Array.isArray(resData)
        ? resData
        : [resData]
      : []

    this.checkIfKeysExist({
      uniqueIds,
      resData,
      expand,
      pkField: pkFieldAdjusted,
      relationship,
      options,
    })

    const filteredDataArray = resData.map((data: any) =>
      RemoteJoiner.filterFields(data, expand.fields, expand.expands)
    )

    if (isObj) {
      response.data[response.path!] = filteredDataArray
    } else {
      response.data = filteredDataArray
    }

    return response
  }

  private checkIfKeysExist(params: {
    uniqueIds: unknown[] | undefined
    resData: any[]
    expand: RemoteExpandProperty
    pkField: string
    relationship?: any
    options?: RemoteJoinerOptions
  }) {
    const { uniqueIds, resData, expand, pkField, relationship, options } =
      params

    if (
      !(
        isDefined(uniqueIds) &&
        ((options?.throwIfKeyNotFound && !isDefined(relationship)) ||
          (options?.throwIfRelationNotFound && isDefined(relationship)))
      )
    ) {
      return
    }

    if (isDefined(relationship)) {
      if (
        Array.isArray(options?.throwIfRelationNotFound) &&
        !options?.throwIfRelationNotFound.includes(relationship.serviceName)
      ) {
        return
      }
    }

    const notFound = new Set(uniqueIds)
    resData.forEach((data) => {
      notFound.delete(data[pkField])
    })

    if (notFound.size > 0) {
      const entityName =
        expand.serviceConfig.entity ??
        expand.serviceConfig.args?.methodSuffix ??
        expand.serviceConfig.serviceName

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `${entityName} ${pkField} not found: ` + Array.from(notFound).join(", ")
      )
    }
  }

  private handleFieldAliases(params: {
    items: any[]
    parsedExpands: Map<string, RemoteExpandProperty>
    implodeMapping: InternalImplodeMapping[]
  }) {
    const { items, parsedExpands, implodeMapping } = params

    const getChildren = (item: any, prop: string) => {
      if (Array.isArray(item)) {
        return item.flatMap((currentItem) => currentItem[prop])
      } else {
        return item[prop]
      }
    }
    const removeChildren = (item: any, prop: string) => {
      if (Array.isArray(item)) {
        for (let i = 0; i < item.length; i++) {
          Object.defineProperty(item[i], prop, {
            value: undefined,
            enumerable: false,
          })
        }
      } else {
        Object.defineProperty(item, prop, {
          value: undefined,
          enumerable: false,
        })
      }
    }

    const cleanup: [any, string][] = []
    for (const alias of implodeMapping) {
      const propPath = alias.path

      let itemsLocation = items
      for (const locationProp of alias.location) {
        propPath.shift()
        itemsLocation = RemoteJoiner.getNestedItems(itemsLocation, locationProp)
      }

      itemsLocation.forEach((locationItem) => {
        if (!locationItem) {
          return
        }

        let currentItems = locationItem
        let parentRemoveItems: any = null

        const curPath: string[] = [BASE_PATH].concat(alias.location)
        for (const prop of propPath) {
          if (!isDefined(currentItems)) {
            break
          }

          curPath.push(prop)

          const config = parsedExpands.get(curPath.join(".")) as any
          if (config?.isAliasMapping && parentRemoveItems === null) {
            parentRemoveItems = [currentItems, prop]
          }

          currentItems = getChildren(currentItems, prop)
        }

        if (Array.isArray(currentItems)) {
          if (currentItems.length < 2 && !alias.isList) {
            locationItem[alias.property] = currentItems.shift()
          } else {
            locationItem[alias.property] = currentItems
          }
        } else {
          locationItem[alias.property] = alias.isList
            ? isDefined(currentItems)
              ? [currentItems]
              : []
            : currentItems
        }

        if (parentRemoveItems !== null) {
          cleanup.push(parentRemoveItems)
        }
      })
    }

    for (const parentRemoveItems of cleanup) {
      const [remItems, path] = parentRemoveItems
      removeChildren(remItems, path)
    }
  }

  private async handleExpands(params: {
    items: any[]
    parsedExpands: Map<string, RemoteExpandProperty>
    implodeMapping?: InternalImplodeMapping[]
    options?: RemoteJoinerOptions
  }): Promise<void> {
    const { items, parsedExpands, implodeMapping = [], options } = params

    if (parsedExpands.size === 0) {
      return
    }

    const getItemsForPath = (rootItems: any[], fullPath: string) => {
      let nestedItems = rootItems
      const expandedPathLevels = fullPath.split(".")

      for (let idx = 1; idx < expandedPathLevels.length - 1; idx++) {
        nestedItems = RemoteJoiner.getNestedItems(
          nestedItems,
          expandedPathLevels[idx]
        )
      }

      return nestedItems
    }

    const root = parsedExpands.get(BASE_PATH) as any
    const executionStages: {
      service: string
      paths: string[]
      depth: number
    }[][] = root?.executionStages
    // remove root
    root?.executionStages.shift()

    for (const stage of executionStages) {
      const stageFetchGroups: any[] = []
      for (const { paths } of stage) {
        const pathCtx: {
          path: string
          expand: RemoteExpandProperty
          relationship: ComputedJoinerRelationship
          nestedItems: any[]
          field: string
          fieldsArray: string[]
          args?: any
          ids: Set<string>
        }[] = []

        for (const path of paths) {
          const expand = parsedExpands.get(path)!
          const nestedItems = getItemsForPath(items, path)

          if (!nestedItems?.length || !expand) {
            continue
          }

          const relationship = this.getEntityRelationship({
            parentServiceConfig: expand.parentConfig!,
            property: expand.property,
            entity: expand.entity,
          })

          if (!relationship) {
            continue
          }

          const { field, fieldsArray, idsToFetch } =
            this.computeIdsForRelationship(nestedItems, relationship)

          pathCtx.push({
            path,
            expand,
            relationship,
            nestedItems,
            field,
            fieldsArray,
            args: expand.args,
            ids: idsToFetch,
          })
        }

        if (!pathCtx.length) {
          continue
        }

        // Group by pkField
        const byPkField = new Map()
        for (const ctx of pathCtx) {
          const key = ctx.field
          if (!byPkField.has(key)) {
            byPkField.set(key, [])
          }
          byPkField.get(key)!.push(ctx)
        }

        for (const [pkField, ctxs] of byPkField.entries()) {
          const unionIds: any[] = Array.from(
            new Set(ctxs.flatMap((c) => Array.from(c.ids)))
          )
          const unionFields = Array.from(
            new Set(ctxs.flatMap((c) => c.expand.fields ?? []))
          )
          const unionArgs = ctxs.flatMap((c) => c.expand.args ?? [])

          const base = ctxs[0].expand
          const aggExpand: RemoteExpandProperty = {
            ...base,
            fields: unionFields,
          }

          if (unionArgs.length) {
            aggExpand.args = unionArgs
          }

          const relationship = ctxs[0].relationship

          const promise = this.fetchData({
            expand: aggExpand,
            pkField,
            ids: unionIds,
            relationship,
            options,
          })

          stageFetchGroups.push({ ctxs, relationship, promise })
        }
      }

      const stageResults = await Promise.all(
        stageFetchGroups.map((g) => g.promise)
      )

      for (let i = 0; i < stageFetchGroups.length; i++) {
        const { ctxs, relationship } = stageFetchGroups[i]
        const relatedDataArray = stageResults[i]

        const joinFields = relationship.inverse
          ? relationship.foreignKeyArr
          : relationship.primaryKeyArr

        const relData = relatedDataArray.path
          ? (relatedDataArray.data as any)[relatedDataArray.path!]
          : relatedDataArray.data

        const relatedDataMap = RemoteJoiner.createRelatedDataMap(
          relData,
          joinFields
        )

        for (let ci = 0; ci < ctxs.length; ci++) {
          const ctx = ctxs[ci]
          this.assignRelatedToItems({
            items: ctx.nestedItems,
            relationship: ctx.relationship,
            relatedDataMap,
            field: ctx.field,
            fieldsArray: ctx.fieldsArray,
          })
        }
      }
    }

    if (implodeMapping.length > 0) {
      this.handleFieldAliases({
        items,
        parsedExpands,
        implodeMapping,
      })
    }
  }

  private getEntityRelationship(params: {
    parentServiceConfig: InternalJoinerServiceConfig
    property: string
    entity?: string
  }): ComputedJoinerRelationship {
    const { parentServiceConfig, property, entity } = params

    const propEntity = entity ?? parentServiceConfig?.entity
    const rel = parentServiceConfig?.relationships?.get(property)

    if (Array.isArray(rel)) {
      if (!propEntity) {
        return rel[0] as ComputedJoinerRelationship
      }

      const entityRel = rel.find((r) => r.entity === propEntity)
      if (entityRel) {
        return entityRel as ComputedJoinerRelationship
      }

      // If entity is not found, return the relationship where the primary key matches
      const serviceEntity = this.getServiceConfig({
        entity: propEntity,
      })!

      return rel.find((r) =>
        serviceEntity.primaryKeys.includes(r.primaryKey)
      )! as ComputedJoinerRelationship
    }

    return rel as ComputedJoinerRelationship
  }

  private parseExpands(
    params: InternalParseExpandsParams
  ): Map<string, RemoteExpandProperty> {
    const {
      initialService,
      query,
      serviceConfig,
      expands,
      implodeMapping,
      options,
      initialData,
      initialDataOnly,
    } = params

    const { parsedExpands, aliasRealPathMap } = this.parseProperties({
      initialService,
      query,
      serviceConfig,
      expands,
      implodeMapping,
    })

    if (initialData?.length && initialDataOnly) {
      this.createFilterFromInitialData({
        initialData: options?.initialData as any,
        parsedExpands,
        aliasRealPathMap,
      })
    }

    const groupedExpands = this.groupExpands(parsedExpands)

    this.buildQueryPlan(parsedExpands, groupedExpands)

    return groupedExpands
  }

  private buildQueryPlan(
    fullParsedExpands: Map<string, RemoteExpandProperty>,
    groupedExpands: Map<string, RemoteExpandProperty>
  ): void {
    const stages: ExecutionStage[][] = []

    // Root stage
    const rootExp = groupedExpands.get(BASE_PATH)!
    const rootService = rootExp.serviceConfig.serviceName

    stages.push([
      {
        service: rootService,
        entity: rootExp.entity,
        paths: [],
        depth: 0,
      },
    ])

    // Build service sequence for each path
    const getServiceSequence = (path: string): string[] => {
      const sequence: string[] = []
      let currentPath = path

      while (currentPath && currentPath !== BASE_PATH) {
        const expand = fullParsedExpands.get(currentPath)
        if (!expand) {
          break
        }

        sequence.unshift(expand.serviceConfig.serviceName)
        currentPath = expand.parent
      }

      return sequence
    }

    // Group paths by their service sequence length and last service in sequence
    const pathsBySequenceDepth = new Map<number, Map<string, string[]>>()

    for (const [path, expand] of groupedExpands.entries()) {
      if (path === BASE_PATH) {
        continue
      }

      const serviceSequence = getServiceSequence(path)
      const sequenceDepth = serviceSequence.length
      const lastService = expand.serviceConfig.serviceName

      if (!pathsBySequenceDepth.has(sequenceDepth)) {
        pathsBySequenceDepth.set(sequenceDepth, new Map())
      }

      const depthMap = pathsBySequenceDepth.get(sequenceDepth)!
      if (!depthMap.has(lastService)) {
        depthMap.set(lastService, [])
      }

      depthMap.get(lastService)!.push(path)
    }

    const maxDepth = Math.max(...Array.from(pathsBySequenceDepth.keys()))

    for (let depth = 1; depth <= maxDepth; depth++) {
      const serviceMap = pathsBySequenceDepth.get(depth)
      if (!serviceMap) {
        continue
      }

      const stageGroups: ExecutionStage[] = []
      for (const [service, paths] of serviceMap.entries()) {
        stageGroups.push({
          service,
          paths,
          depth: depth,
        })
      }

      if (stageGroups.length > 0) {
        stages.push(stageGroups)
      }
    }

    const root = groupedExpands.get(BASE_PATH)!
    root.executionStages = stages
  }

  private parseProperties(params: {
    initialService: RemoteExpandProperty
    query: RemoteJoinerQuery
    serviceConfig: InternalJoinerServiceConfig
    expands: RemoteJoinerQuery["expands"]
    implodeMapping: InternalImplodeMapping[]
  }): {
    parsedExpands: Map<string, RemoteExpandProperty>
    aliasRealPathMap: Map<string, string[]>
  } {
    const { initialService, query, serviceConfig, expands, implodeMapping } =
      params

    const aliasRealPathMap = new Map<string, string[]>()
    const parsedExpands = new Map<string, any>()
    parsedExpands.set(BASE_PATH, initialService)

    const forwardArgumentsOnPath: string[] = []
    for (const expand of expands || []) {
      const properties = expand.property.split(".")
      const currentPath: string[] = []
      const currentAliasPath: string[] = []
      let currentServiceConfig = serviceConfig

      for (const prop of properties) {
        const fieldAlias = currentServiceConfig.fieldAlias ?? {}
        if (fieldAlias[prop]) {
          const aliasPath = [BASE_PATH, ...currentPath, prop].join(".")

          const lastServiceConfig = this.parseAlias({
            aliasPath,
            aliasRealPathMap,
            expands,
            expand,
            property: prop,
            parsedExpands,
            currentServiceConfig,
            currentPath,
            implodeMapping,
            forwardArgumentsOnPath,
          })

          currentAliasPath.push(prop)
          currentServiceConfig = lastServiceConfig
          continue
        }

        const fullPath = [BASE_PATH, ...currentPath, prop].join(".")
        const fullAliasPath = [BASE_PATH, ...currentAliasPath, prop].join(".")

        let entity = currentServiceConfig.entity
        if (entity) {
          const completePath = fullPath.split(".")
          for (let i = 1; i < completePath.length; i++) {
            entity = this.getEntity({ entity, prop: completePath[i] }) ?? entity
          }
        }

        const relationship = this.getEntityRelationship({
          parentServiceConfig: currentServiceConfig,
          property: prop,
          entity,
        })

        const isCurrentProp =
          fullPath === BASE_PATH + "." + expand.property ||
          fullAliasPath == BASE_PATH + "." + expand.property

        let fields: string[] = isCurrentProp ? expand.fields ?? [] : []
        const args = isCurrentProp ? expand.args : []

        if (relationship) {
          const parentExpand =
            parsedExpands.get([BASE_PATH, ...currentPath].join(".")) || query
          if (parentExpand) {
            const parRelField = relationship.inverse
              ? relationship.primaryKey
              : relationship.foreignKey.split(".").pop()!

            parentExpand.fields ??= []

            parentExpand.fields = parentExpand.fields
              .concat(parRelField.split(","))
              .filter((field) => field !== relationship.alias)

            parentExpand.fields = deduplicate(parentExpand.fields)

            const relField = relationship.inverse
              ? relationship.foreignKey.split(".").pop()!
              : relationship.primaryKey
            fields = fields.concat(relField.split(","))
          }

          currentServiceConfig = this.getServiceConfig({
            serviceName: relationship.serviceName,
            entity: relationship.entity,
          })!

          if (!currentServiceConfig) {
            throw new Error(
              `Target service not found: ${relationship.serviceName}`
            )
          }
        }

        const isAliasMapping = (expand as any).isAliasMapping
        if (!parsedExpands.has(fullPath)) {
          let parentPath = [BASE_PATH, ...currentPath].join(".")

          if (aliasRealPathMap.has(parentPath)) {
            parentPath = aliasRealPathMap
              .get(parentPath)!
              .slice(0, -1)
              .join(".")
          }

          parsedExpands.set(fullPath, {
            property: prop,
            serviceConfig: currentServiceConfig,
            entity: entity,
            fields,
            args: isAliasMapping
              ? forwardArgumentsOnPath.includes(fullPath)
                ? args
                : undefined
              : args,
            isAliasMapping: isAliasMapping,
            parent: parentPath,
            parentConfig: parsedExpands.get(parentPath).serviceConfig,
          })
        } else {
          const exp = parsedExpands.get(fullPath)

          if (forwardArgumentsOnPath.includes(fullPath) && args) {
            exp.args = (exp.args || []).concat(args)
          }
          exp.isAliasMapping ??= isAliasMapping

          if (fields) {
            exp.fields = deduplicate((exp.fields ?? []).concat(fields))
          }
        }

        currentPath.push(prop)
        currentAliasPath.push(prop)
      }
    }

    return { parsedExpands, aliasRealPathMap }
  }

  private getEntity({ entity, prop }: { entity: string; prop: string }) {
    return this.entityMap.get(entity)?.get(prop)
  }

  private parseAlias({
    aliasPath,
    aliasRealPathMap,
    expands,
    expand,
    property,
    parsedExpands,
    currentServiceConfig,
    currentPath,
    implodeMapping,
    forwardArgumentsOnPath,
  }) {
    const serviceConfig = currentServiceConfig
    const fieldAlias = currentServiceConfig.fieldAlias ?? {}
    let alias = fieldAlias[property] as any

    // Handle multiple shortcuts for the same property
    if (Array.isArray(alias)) {
      const currentPathEntity = parsedExpands.get(
        [BASE_PATH, ...currentPath].join(".")
      )?.entity

      alias = alias.find((a) => a.entity == currentPathEntity)
      if (!alias) {
        throw new Error(
          `Cannot resolve alias path "${currentPath.join(
            "."
          )}" that matches entity ${currentPathEntity}.`
        )
      }
    }

    const path = isString(alias) ? alias : alias.path
    const fieldAliasIsList = isString(alias) ? false : !!alias.isList
    const fullPath = [...currentPath.concat(path.split("."))]

    if (aliasRealPathMap.has(aliasPath)) {
      currentPath.push(...path.split("."))

      const fullPath = [BASE_PATH, ...currentPath].join(".")
      return parsedExpands.get(fullPath).serviceConfig
    }

    const parentPath = [BASE_PATH, ...currentPath].join(".")
    const parentExpands = parsedExpands.get(parentPath)
    parentExpands.fields = parentExpands.fields?.filter(
      (field) => field !== property
    )

    forwardArgumentsOnPath.push(
      ...(alias?.forwardArgumentsOnPath || []).map(
        (forPath) => BASE_PATH + "." + currentPath.concat(forPath).join(".")
      )
    )

    const parentFieldAlias = fullPath[Math.max(fullPath.length - 2, 0)]
    implodeMapping.push({
      location: [...currentPath],
      property,
      path: fullPath,
      isList:
        fieldAliasIsList ||
        !!serviceConfig.relationships?.get(parentFieldAlias)?.isList,
    })

    const extMapping = expands as unknown[]

    const fullAliasProp = fullPath.join(".")
    const middlePath = path.split(".")
    let curMiddlePath = currentPath
    for (const path of middlePath) {
      curMiddlePath = curMiddlePath.concat(path)

      const midProp = curMiddlePath.join(".")
      const existingExpand = expands.find((exp) => exp.property === midProp)

      const extraExtends = {
        fields: existingExpand?.fields,
        args: existingExpand?.args,
        ...(midProp === fullAliasProp ? expand : {}),
        property: midProp,
        isAliasMapping: !existingExpand,
      }

      if (forwardArgumentsOnPath.includes(BASE_PATH + "." + midProp)) {
        const forwarded = (existingExpand?.args ?? []).concat(
          expand?.args ?? []
        )

        if (forwarded.length) {
          extraExtends.args = forwarded
        }
      }

      extMapping.push(extraExtends)
    }

    const partialPath: string[] = []
    for (const partial of path.split(".")) {
      const completePath = [
        BASE_PATH,
        ...currentPath.concat(partialPath),
        partial,
      ]
      const parentPath = completePath.slice(0, -1).join(".")

      let entity = serviceConfig.entity
      if (entity) {
        for (let i = 1; i < completePath.length; i++) {
          entity = this.getEntity({ entity, prop: completePath[i] }) ?? entity
        }
      }

      const relationship = this.getEntityRelationship({
        parentServiceConfig: currentServiceConfig,
        property: partial,
        entity,
      })

      if (relationship) {
        currentServiceConfig = this.getServiceConfig({
          serviceName: relationship.serviceName,
          entity: relationship.entity,
        })!

        if (!currentServiceConfig) {
          throw new Error(
            `Target service not found: ${relationship.serviceName}`
          )
        }
      }

      partialPath.push(partial)
      parsedExpands.set(completePath.join("."), {
        property: partial,
        serviceConfig: currentServiceConfig,
        entity: entity,
        parent: parentPath,
        parentConfig: parsedExpands.get(parentPath).serviceConfig,
      })
    }

    currentPath.push(...path.split("."))
    aliasRealPathMap.set(aliasPath, [BASE_PATH, ...currentPath])

    return currentServiceConfig
  }

  private groupExpands(
    parsedExpands: Map<string, RemoteExpandProperty>
  ): Map<string, RemoteExpandProperty> {
    const mergedExpands = new Map<string, RemoteExpandProperty>(parsedExpands)
    const mergedPaths = new Map<string, RemoteExpandProperty>()

    for (const [path, expand] of mergedExpands.entries()) {
      const currentServiceName = expand.serviceConfig.serviceName
      let parentPath = expand.parent

      while (parentPath) {
        const parentExpand =
          mergedExpands.get(parentPath) ?? mergedPaths.get(parentPath)
        if (
          !parentExpand ||
          parentExpand.serviceConfig.serviceName !== currentServiceName
        ) {
          break
        }

        const nestedKeys = path.split(".").slice(parentPath.split(".").length)
        let targetExpand = parentExpand as Omit<
          RemoteExpandProperty,
          "expands"
        > & { expands?: {} }

        for (const key of nestedKeys) {
          targetExpand.expands ??= {}
          targetExpand = targetExpand.expands[key] ??= {}
        }

        const nextFields = [
          ...new Set([
            ...(targetExpand.fields ?? []),
            ...(expand.fields ?? []),
          ]),
        ]
        targetExpand.fields = nextFields
        if (expand.args?.length) {
          const existingArgs = targetExpand.args
          targetExpand.args = existingArgs
            ? existingArgs.concat(expand.args)
            : expand.args
        }

        mergedExpands.delete(path)
        mergedPaths.set(path, expand)

        parentPath = parentExpand.parent
      }
    }

    return mergedExpands
  }

  private createFilterFromInitialData({
    initialData,
    parsedExpands,
    aliasRealPathMap,
  }: {
    initialData: any[]
    parsedExpands: Map<string, RemoteExpandProperty>
    aliasRealPathMap: Map<string, string[]>
  }): void {
    if (!initialData.length) {
      return
    }

    const getPkValues = ({
      initialData,
      serviceConfig,
      relationship,
    }: {
      initialData: any[]
      serviceConfig: InternalJoinerServiceConfig
      relationship?: JoinerRelationship
    }): Record<string, any> => {
      if (!initialData.length || !relationship || !serviceConfig) {
        return {}
      }

      const primaryKeys = relationship.primaryKey
        ? relationship.primaryKey.split(",")
        : serviceConfig.primaryKeys

      const filter: Record<string, any> = {}

      // Collect IDs for the current level, considering composed keys
      primaryKeys.forEach((key) => {
        filter[key] = Array.from(
          new Set(initialData.map((dt) => dt[key]).filter(isDefined))
        )
      })

      return filter
    }

    const parsedSegment = new Map<string, any>()

    const aliasReversePathMap = new Map<string, string>(
      Array.from(aliasRealPathMap).map(([path, realPath]) => [
        realPath.join("."),
        path,
      ])
    )

    for (let [path, expand] of parsedExpands.entries()) {
      const serviceConfig = expand.serviceConfig
      const relationship =
        this.getEntityRelationship({
          parentServiceConfig: expand.parentConfig!,
          property: expand.property,
        }) ?? serviceConfig.relationships?.get(serviceConfig.serviceName)

      if (!serviceConfig || !relationship) {
        continue
      }

      let aliasToPath: string | null = null
      if (aliasReversePathMap.has(path)) {
        aliasToPath = path
        path = aliasReversePathMap.get(path)!
      }

      const pathSegments = path.split(".")
      let relevantInitialData = initialData
      let fullPath: string[] = []

      for (const segment of pathSegments) {
        fullPath.push(segment)
        if (segment === BASE_PATH) {
          continue
        }

        const pathStr = fullPath.join(".")
        if (parsedSegment.has(pathStr)) {
          relevantInitialData = parsedSegment.get(pathStr)
          continue
        }

        relevantInitialData =
          RemoteJoiner.getNestedItems(relevantInitialData, segment) ?? []

        parsedSegment.set(pathStr, relevantInitialData)

        if (!relevantInitialData.length) {
          break
        }
      }

      if (!relevantInitialData.length) {
        continue
      }

      const queryPath = expand.parent === "" ? BASE_PATH : aliasToPath ?? path
      const filter = getPkValues({
        initialData: relevantInitialData,
        serviceConfig,
        relationship,
      })

      if (!Object.keys(filter).length) {
        continue
      }

      const parsed = parsedExpands.get(queryPath)!
      parsed.args ??= []
      parsed.args.push({
        name: "filters",
        value: filter,
      })
    }
  }

  private mergeInitialData({
    items,
    initialData,
    serviceConfig,
    path,
    expands,
    relationship,
  }: {
    items: any[]
    initialData: any[]
    serviceConfig: InternalJoinerServiceConfig
    path: string
    expands?: RemoteNestedExpands
    relationship?: JoinerRelationship
  }) {
    if (!initialData.length || !relationship) {
      return items
    }

    const primaryKeys = relationship?.primaryKey.split(",") || [
      serviceConfig.primaryKeys[0],
    ]
    const expandKeys = Object.keys(expands ?? {})

    const initialDataIndexMap = new Map(
      initialData.map((dt, index) => [
        primaryKeys.map((key) => dt[key]).join(","),
        index,
      ])
    )
    const itemMap = new Map(
      items.map((item) => [primaryKeys.map((key) => item[key]).join(","), item])
    )

    const orderedMergedItems = new Array(initialData.length)
    for (const [key, index] of initialDataIndexMap.entries()) {
      const iniData = initialData[index]
      const item = itemMap.get(key)

      if (!item) {
        orderedMergedItems[index] = iniData
        continue
      }

      // Only merge properties that are not relations
      const shallowProperty = { ...iniData }
      for (const key of expandKeys) {
        const isRel = !!this.getEntityRelationship({
          parentServiceConfig: serviceConfig,
          property: key,
        })
        if (isRel) {
          Object.defineProperty(shallowProperty, key, {
            value: undefined,
            enumerable: false,
          })
        }
      }

      Object.assign(item, shallowProperty)
      orderedMergedItems[index] = item
    }

    if (expands) {
      for (const expand of expandKeys) {
        this.mergeInitialData({
          items: items.flatMap((dt) => dt[expand] ?? []),
          initialData: initialData
            .flatMap((dt) => dt[expand] ?? [])
            .filter(isDefined),
          serviceConfig,
          path: `${path}.${expand}`,
          expands: expands[expand]?.expands,
          relationship: this.getEntityRelationship({
            parentServiceConfig: serviceConfig,
            property: expand,
          }),
        })
      }
    }

    return orderedMergedItems
  }

  async query(
    queryObj: RemoteJoinerQuery,
    options?: RemoteJoinerOptions
  ): Promise<any> {
    const serviceConfig = this.getServiceConfig({
      serviceName: queryObj.service,
      serviceAlias: queryObj.alias,
    })

    if (!serviceConfig) {
      if (queryObj.alias) {
        throw new Error(`Service with alias "${queryObj.alias}" was not found.`)
      }

      throw new Error(`Service "${queryObj.service}" was not found.`)
    }

    const iniDataArray = options?.initialData
      ? Array.isArray(options.initialData)
        ? options.initialData
        : [options.initialData]
      : []

    const implodeMapping: InternalImplodeMapping[] = []
    const parseExpandsConfig: InternalParseExpandsParams = {
      initialService: {
        property: "",
        parent: "",
        serviceConfig,
        entity: serviceConfig.entity,
        fields: queryObj.fields,
      },
      query: queryObj,
      serviceConfig,
      expands: queryObj.expands!,
      implodeMapping,
      options,
      initialData: iniDataArray,
      initialDataOnly: options?.initialDataOnly,
    }

    const parsedExpands = this.parseExpands(parseExpandsConfig)
    const root = parsedExpands.get(BASE_PATH)!

    const { primaryKeyArg, otherArgs, pkName } = gerPrimaryKeysAndOtherFilters({
      serviceConfig,
      queryObj,
    })

    if (otherArgs) {
      parseExpandsConfig.initialService.args = otherArgs
    }

    if (options?.throwIfKeyNotFound) {
      if (primaryKeyArg?.value == undefined) {
        if (!primaryKeyArg) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `${
              serviceConfig.entity ?? serviceConfig.serviceName
            }: Primary key(s) [${serviceConfig.primaryKeys.join(
              ", "
            )}] not found in filters`
          )
        }

        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `${
            serviceConfig.entity ?? serviceConfig.serviceName
          }: Value for primary key ${primaryKeyArg.name} not found in filters`
        )
      }
    }

    const response = await this.fetchData({
      expand: root,
      pkField: pkName,
      ids: primaryKeyArg?.value,
      options,
    })

    let data = response.path ? response.data[response.path!] : response.data
    const isDataArray = Array.isArray(data)

    data = isDataArray ? data : [data]

    if (options?.initialData) {
      data = this.mergeInitialData({
        items: data,
        initialData: iniDataArray,
        serviceConfig,
        path: BASE_PATH,
        expands: parsedExpands.get(BASE_PATH)?.expands,
        relationship: serviceConfig.relationships?.get(
          serviceConfig.serviceName
        ) as JoinerRelationship,
      })

      delete options?.initialData
    }

    await this.handleExpands({
      items: data,
      parsedExpands,
      implodeMapping,
      options,
    })

    const retData = isDataArray ? data : data[0]
    if (response.path) {
      response.data[response.path] = retData
    } else {
      response.data = retData
    }

    return response.data
  }
}

function gerPrimaryKeysAndOtherFilters({ serviceConfig, queryObj }): {
  primaryKeyArg: { name: string; value: any } | undefined
  otherArgs: { name: string; value: any }[] | undefined
  pkName: string
} {
  let pkName = serviceConfig.primaryKeys[0]
  let primaryKeyArg = queryObj.args?.find((arg) => {
    const include = serviceConfig.primaryKeys.includes(arg.name)
    if (include) {
      pkName = arg.name
    }
    return include
  })

  let otherArgs = queryObj.args?.filter(
    (arg) => !serviceConfig.primaryKeys.includes(arg.name)
  )

  if (!primaryKeyArg) {
    const filters =
      queryObj.args?.find((arg) => arg.name === "filters")?.value ?? {}

    const primaryKeyFilter = Object.keys(filters).find((key) => {
      return serviceConfig.primaryKeys.includes(key)
    })

    if (primaryKeyFilter) {
      pkName = primaryKeyFilter
      primaryKeyArg = {
        name: primaryKeyFilter,
        value: filters[primaryKeyFilter],
      }

      Object.defineProperty(filters, primaryKeyFilter, {
        value: undefined,
        enumerable: false,
      })
    }
  }

  otherArgs = otherArgs?.length ? otherArgs : undefined

  return {
    primaryKeyArg,
    otherArgs,
    pkName,
  }
}
