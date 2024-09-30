import {
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
  GraphQLUtils,
  isDefined,
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
        const rel = extend.relationship
        if (service_.relationships?.has(aliasName)) {
          const existing = service_.relationships.get(aliasName)!
          const newRelation = Array.isArray(existing)
            ? existing.concat(rel)
            : [existing, rel]

          service_.relationships?.set(aliasName, newRelation)
        } else {
          service_.relationships?.set(aliasName, rel)
        }

        Object.assign(service_.fieldAlias ?? {}, extend.fieldAlias)
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
        const rel = relationship as JoinerRelationship
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
        ).filter((alias) => fieldAlias[alias])

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

    let uniqueIds = Array.isArray(ids) ? ids : ids ? [ids] : undefined

    if (uniqueIds) {
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

      uniqueIds = uniqueIds.filter((id) => isDefined(id))
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
        item.forEach((currentItem) => delete currentItem[prop])
      } else {
        delete item[prop]
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

    if (!parsedExpands) {
      return
    }

    for (const [expandedPath, expand] of parsedExpands.entries()) {
      if (expandedPath === BASE_PATH) {
        continue
      }

      let nestedItems = items
      const expandedPathLevels = expandedPath.split(".")

      for (let idx = 1; idx < expandedPathLevels.length - 1; idx++) {
        nestedItems = RemoteJoiner.getNestedItems(
          nestedItems,
          expandedPathLevels[idx]
        )
      }

      if (nestedItems.length > 0) {
        await this.expandProperty({
          items: nestedItems,
          parentServiceConfig: expand.parentConfig!,
          expand,
          options,
        })
      }
    }

    this.handleFieldAliases({ items, parsedExpands, implodeMapping })
  }

  private getEntityRelationship(params: {
    parentServiceConfig: InternalJoinerServiceConfig
    property: string
    entity?: string
  }): JoinerRelationship {
    const { parentServiceConfig, property, entity } = params

    const propEntity = entity ?? parentServiceConfig?.entity
    const rel = parentServiceConfig?.relationships?.get(property)

    if (Array.isArray(rel)) {
      if (!propEntity) {
        return rel[0]
      }

      const entityRel = rel.find((r) => r.entity === propEntity)
      if (entityRel) {
        return entityRel
      }

      // If entity is not found, return the relationship where the primary key matches
      const serviceEntity = this.getServiceConfig({
        entity: propEntity,
      })!

      return rel.find((r) => serviceEntity.primaryKeys.includes(r.primaryKey))!
    }

    return rel as JoinerRelationship
  }

  private async expandProperty(params: {
    items: any[]
    parentServiceConfig: InternalJoinerServiceConfig
    expand?: RemoteExpandProperty
    options?: RemoteJoinerOptions
  }): Promise<void> {
    const { items, parentServiceConfig, expand, options } = params

    if (!expand) {
      return
    }

    const relationship = this.getEntityRelationship({
      parentServiceConfig,
      property: expand.property,
      entity: expand.entity,
    })

    if (!relationship) {
      return
    }

    await this.expandRelationshipProperty({
      items,
      expand,
      relationship,
      options,
    })
  }

  private async expandRelationshipProperty(params: {
    items: any[]
    expand: RemoteExpandProperty
    relationship: JoinerRelationship
    options?: RemoteJoinerOptions
  }): Promise<void> {
    const { items, expand, relationship, options } = params

    const field = relationship.inverse
      ? relationship.primaryKey
      : relationship.foreignKey.split(".").pop()!
    const fieldsArray = field.split(",")

    const idsToFetch: any[] = []

    items.forEach((item) => {
      const values = fieldsArray.map((field) => item?.[field])

      if (values.length === fieldsArray.length && !item?.[relationship.alias]) {
        if (fieldsArray.length === 1) {
          if (!idsToFetch.includes(values[0])) {
            idsToFetch.push(values[0])
          }
        } else {
          // composite key
          const valuesString = values.join(",")

          if (!idsToFetch.some((id) => id.join(",") === valuesString)) {
            idsToFetch.push(values)
          }
        }
      }
    })

    if (idsToFetch.length === 0) {
      return
    }

    const relatedDataArray = await this.fetchData({
      expand,
      pkField: field,
      ids: idsToFetch,
      relationship,
      options,
    })

    const joinFields = relationship.inverse
      ? relationship.foreignKey.split(",")
      : relationship.primaryKey.split(",")

    const relData = relatedDataArray.path
      ? relatedDataArray.data[relatedDataArray.path!]
      : relatedDataArray.data

    const relatedDataMap = RemoteJoiner.createRelatedDataMap(
      relData,
      joinFields
    )

    items.forEach((item) => {
      if (!item || item[relationship.alias]) {
        return
      }

      const itemKey = fieldsArray.map((field) => item[field]).join(",")

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

  private parseExpands(params: {
    initialService: RemoteExpandProperty
    query: RemoteJoinerQuery
    serviceConfig: InternalJoinerServiceConfig
    expands: RemoteJoinerQuery["expands"]
    implodeMapping: InternalImplodeMapping[]
    options?: RemoteJoinerOptions
  }): Map<string, RemoteExpandProperty> {
    const { initialService, query, serviceConfig, expands, implodeMapping } =
      params

    const parsedExpands = this.parseProperties({
      initialService,
      query,
      serviceConfig,
      expands,
      implodeMapping,
    })

    const groupedExpands = this.groupExpands(parsedExpands)

    return groupedExpands
  }

  private parseProperties(params: {
    initialService: RemoteExpandProperty
    query: RemoteJoinerQuery
    serviceConfig: InternalJoinerServiceConfig
    expands: RemoteJoinerQuery["expands"]
    implodeMapping: InternalImplodeMapping[]
  }): Map<string, RemoteExpandProperty> {
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

    return parsedExpands
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
    const alias = fieldAlias[property] as any

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
        ...(midProp === fullAliasProp ? expand : {}),
        property: midProp,
        isAliasMapping: !existingExpand,
      }

      if (forwardArgumentsOnPath.includes(BASE_PATH + "." + midProp)) {
        extraExtends.args = (existingExpand?.args ?? []).concat(
          expand?.args ?? []
        )
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

        targetExpand.fields = [...new Set(expand.fields)]
        targetExpand.args = expand.args

        mergedExpands.delete(path)
        mergedPaths.set(path, expand)

        parentPath = parentExpand.parent
      }
    }

    return mergedExpands
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

    const { primaryKeyArg, otherArgs, pkName } = gerPrimaryKeysAndOtherFilters({
      serviceConfig,
      queryObj,
    })

    const implodeMapping: InternalImplodeMapping[] = []
    const parseExpandsConfig: Parameters<typeof this.parseExpands>[0] = {
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
    }

    if (otherArgs) {
      parseExpandsConfig.initialService.args = otherArgs
    }

    const parsedExpands = this.parseExpands(parseExpandsConfig)

    const root = parsedExpands.get(BASE_PATH)!

    const response = await this.fetchData({
      expand: root,
      pkField: pkName,
      ids: primaryKeyArg?.value,
      options,
    })

    const data = response.path ? response.data[response.path!] : response.data

    await this.handleExpands({
      items: Array.isArray(data) ? data : [data],
      parsedExpands,
      implodeMapping,
      options,
    })

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

  const filters =
    queryObj.args?.find((arg) => arg.name === "filters")?.value ?? {}

  if (!primaryKeyArg) {
    const primaryKeyFilter = Object.keys(filters).find((key) => {
      return serviceConfig.primaryKeys.includes(key)
    })

    if (primaryKeyFilter) {
      pkName = primaryKeyFilter
      primaryKeyArg = {
        name: primaryKeyFilter,
        value: filters[primaryKeyFilter],
      }

      delete filters[primaryKeyFilter]
    }
  }

  otherArgs = otherArgs?.length ? otherArgs : undefined

  return {
    primaryKeyArg,
    otherArgs,
    pkName,
  }
}
