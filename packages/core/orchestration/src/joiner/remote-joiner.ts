import {
  JoinerRelationship,
  JoinerServiceConfig,
  JoinerServiceConfigAlias,
  ModuleJoinerConfig,
  RemoteExpandProperty,
  RemoteJoinerQuery,
  RemoteNestedExpands,
} from "@medusajs/types"

import { RemoteJoinerOptions } from "@medusajs/types"
import { MedusaError, deduplicate, isDefined, isString } from "@medusajs/utils"
import GraphQLParser from "./graphql-ast"

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
  private serviceConfigCache: Map<string, JoinerServiceConfig> = new Map()

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
    return items.flatMap((item) => item?.[property])
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
    const parser = new GraphQLParser(graphqlQuery, variables)
    return parser.parseQuery()
  }

  constructor(
    private serviceConfigs: ModuleJoinerConfig[],
    private remoteFetchData: RemoteFetchDataCallback,
    private options: {
      autoCreateServiceNameAlias?: boolean
    } = {}
  ) {
    this.options.autoCreateServiceNameAlias ??= true

    this.serviceConfigs = this.buildReferences(
      JSON.parse(JSON.stringify(serviceConfigs))
    )
  }

  public setFetchDataCallback(remoteFetchData: RemoteFetchDataCallback): void {
    this.remoteFetchData = remoteFetchData
  }

  private buildReferences(serviceConfigs: ModuleJoinerConfig[]) {
    const expandedRelationships: Map<
      string,
      { fieldAlias; relationships: JoinerRelationship[] }
    > = new Map()

    for (const service of serviceConfigs) {
      if (this.serviceConfigCache.has(service.serviceName!)) {
        throw new Error(`Service "${service.serviceName}" is already defined.`)
      }

      service.fieldAlias ??= {}
      service.relationships ??= []
      service.extends ??= []

      // add aliases
      const isReadOnlyDefinition =
        !isDefined(service.serviceName) || service.isReadOnlyLink
      if (!isReadOnlyDefinition) {
        service.alias ??= []

        if (!Array.isArray(service.alias)) {
          service.alias = [service.alias]
        }

        if (this.options.autoCreateServiceNameAlias) {
          service.alias.push({ name: service.serviceName! })
        }

        // handle alias.name as array
        for (let idx = 0; idx < service.alias.length; idx++) {
          const alias = service.alias[idx]
          if (!Array.isArray(alias.name)) {
            continue
          }

          for (const name of alias.name) {
            service.alias.push({
              name,
              args: alias.args,
            })
          }
          service.alias.splice(idx, 1)
          idx--
        }

        // self-reference
        for (const alias of service.alias) {
          if (this.serviceConfigCache.has(`alias_${alias.name}}`)) {
            const defined = this.serviceConfigCache.get(`alias_${alias.name}}`)

            if (service.serviceName === defined?.serviceName) {
              continue
            }

            throw new Error(
              `Cannot add alias "${alias.name}" for "${service.serviceName}". It is already defined for Service "${defined?.serviceName}".`
            )
          }

          const args =
            service.args || alias.args
              ? { ...service.args, ...alias.args }
              : undefined

          service.relationships?.push({
            alias: alias.name as string,
            foreignKey: alias.name + "_id",
            primaryKey: "id",
            serviceName: service.serviceName!,
            args,
          })
          this.cacheServiceConfig(
            serviceConfigs,
            undefined,
            alias.name as string
          )
        }

        this.cacheServiceConfig(serviceConfigs, service.serviceName)
      }

      for (const extend of service.extends) {
        if (!expandedRelationships.has(extend.serviceName)) {
          expandedRelationships.set(extend.serviceName, {
            fieldAlias: {},
            relationships: [],
          })
        }

        const service_ = expandedRelationships.get(extend.serviceName)!
        service_.relationships.push(extend.relationship)
        Object.assign(service_.fieldAlias ?? {}, extend.fieldAlias)
      }
    }

    for (const [
      serviceName,
      { fieldAlias, relationships },
    ] of expandedRelationships) {
      if (!this.serviceConfigCache.has(serviceName)) {
        // If true, the relationship is an internal service from the medusa core
        // If modules are being used ouside of the core, we should not be throwing
        // errors when the core services are not found in cache.
        // TODO: Remove when there are no more "internal" services
        const isInternalServicePresent = relationships.some(
          (rel) => rel.isInternalService === true
        )

        if (isInternalServicePresent) {
          continue
        }

        throw new Error(`Service "${serviceName}" was not found`)
      }

      const service_ = this.serviceConfigCache.get(serviceName)!
      service_.relationships?.push(...relationships)
      Object.assign(service_.fieldAlias!, fieldAlias ?? {})

      if (Object.keys(service_.fieldAlias!).length) {
        const conflictAliases = service_.relationships!.filter(
          (relationship) => {
            return fieldAlias[relationship.alias]
          }
        )

        if (conflictAliases.length) {
          throw new Error(
            `Conflict configuration for service "${serviceName}". The following aliases are already defined as relationships: ${conflictAliases
              .map((relationship) => relationship.alias)
              .join(", ")}`
          )
        }
      }
    }

    return serviceConfigs
  }

  private getServiceConfig(
    serviceName?: string,
    serviceAlias?: string
  ): JoinerServiceConfig | undefined {
    if (serviceAlias) {
      const name = `alias_${serviceAlias}`
      return this.serviceConfigCache.get(name)
    }

    return this.serviceConfigCache.get(serviceName!)
  }

  private cacheServiceConfig(
    serviceConfigs,
    serviceName?: string,
    serviceAlias?: string
  ): void {
    if (serviceAlias) {
      const name = `alias_${serviceAlias}`
      if (!this.serviceConfigCache.has(name)) {
        let aliasConfig: JoinerServiceConfigAlias | undefined
        const config = serviceConfigs.find((conf) => {
          const aliases = conf.alias as JoinerServiceConfigAlias[]
          const hasArgs = aliases?.find((alias) => alias.name === serviceAlias)
          aliasConfig = hasArgs
          return hasArgs
        })

        if (config) {
          const serviceConfig = { ...config }
          if (aliasConfig) {
            serviceConfig.args = { ...config?.args, ...aliasConfig?.args }
          }
          this.serviceConfigCache.set(name, serviceConfig)
        }
      }
      return
    }

    const config = serviceConfigs.find(
      (config) => config.serviceName === serviceName
    )
    this.serviceConfigCache.set(serviceName!, config)
  }

  private async fetchData(
    expand: RemoteExpandProperty,
    pkField: string,
    ids?: (unknown | unknown[])[],
    relationship?: any,
    options?: RemoteJoinerOptions
  ): Promise<{
    data: unknown[] | { [path: string]: unknown }
    path?: string
  }> {
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

    if (relationship) {
      pkField = relationship.inverse
        ? relationship.foreignKey.split(".").pop()!
        : relationship.primaryKey
    }

    const response = await this.remoteFetchData(
      expand,
      pkField,
      uniqueIds,
      relationship
    )

    const isObj = isDefined(response.path)
    let resData = isObj ? response.data[response.path!] : response.data

    resData = Array.isArray(resData) ? resData : [resData]

    this.checkIfKeysExist(
      uniqueIds,
      resData,
      expand,
      pkField,
      relationship,
      options
    )

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

  private checkIfKeysExist(
    uniqueIds: unknown[] | undefined,
    resData: any[],
    expand: RemoteExpandProperty,
    pkField: string,
    relationship?: any,
    options?: RemoteJoinerOptions
  ) {
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
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `${expand.serviceConfig.serviceName} ${pkField} not found: ` +
          Array.from(notFound).join(", ")
      )
    }
  }

  private handleFieldAliases(
    items: any[],
    parsedExpands: Map<string, RemoteExpandProperty>,
    implodeMapping: InternalImplodeMapping[]
  ) {
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

  private async handleExpands(
    items: any[],
    parsedExpands: Map<string, RemoteExpandProperty>,
    implodeMapping: InternalImplodeMapping[] = [],
    options?: RemoteJoinerOptions
  ): Promise<void> {
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
        await this.expandProperty(
          nestedItems,
          expand.parentConfig!,
          expand,
          options
        )
      }
    }

    this.handleFieldAliases(items, parsedExpands, implodeMapping)
  }

  private async expandProperty(
    items: any[],
    parentServiceConfig: JoinerServiceConfig,
    expand?: RemoteExpandProperty,
    options?: RemoteJoinerOptions
  ): Promise<void> {
    if (!expand) {
      return
    }

    const relationship = parentServiceConfig?.relationships?.find(
      (relation) => relation.alias === expand.property
    )

    if (relationship) {
      await this.expandRelationshipProperty(
        items,
        expand,
        relationship,
        options
      )
    }
  }

  private async expandRelationshipProperty(
    items: any[],
    expand: RemoteExpandProperty,
    relationship: JoinerRelationship,
    options?: RemoteJoinerOptions
  ): Promise<void> {
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

    const relatedDataArray = await this.fetchData(
      expand,
      field,
      idsToFetch,
      relationship,
      options
    )

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

  private parseExpands(
    initialService: RemoteExpandProperty,
    query: RemoteJoinerQuery,
    serviceConfig: JoinerServiceConfig,
    expands: RemoteJoinerQuery["expands"],
    implodeMapping: InternalImplodeMapping[],
    options?: RemoteJoinerOptions
  ): Map<string, RemoteExpandProperty> {
    const parsedExpands = this.parseProperties(
      initialService,
      query,
      serviceConfig,
      expands,
      implodeMapping,
      options
    )

    const groupedExpands = this.groupExpands(parsedExpands)

    return groupedExpands
  }

  private parseProperties(
    initialService: RemoteExpandProperty,
    query: RemoteJoinerQuery,
    serviceConfig: JoinerServiceConfig,
    expands: RemoteJoinerQuery["expands"],
    implodeMapping: InternalImplodeMapping[],
    options?: RemoteJoinerOptions
  ): Map<string, RemoteExpandProperty> {
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

        const relationship = currentServiceConfig.relationships?.find(
          (relation) => relation.alias === prop
        )

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

          currentServiceConfig = this.getServiceConfig(
            relationship.serviceName
          )!

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

    // remove alias from fields
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
        !!serviceConfig.relationships?.find(
          (relationship) => relationship.alias === parentFieldAlias
        )?.isList,
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
      const relationship = currentServiceConfig.relationships?.find(
        (relation) => relation.alias === partial
      )

      if (relationship) {
        currentServiceConfig = this.getServiceConfig(relationship.serviceName)!

        if (!currentServiceConfig) {
          throw new Error(
            `Target service not found: ${relationship.serviceName}`
          )
        }
      }

      const completePath = [
        BASE_PATH,
        ...currentPath.concat(partialPath),
        partial,
      ]
      const parentPath = completePath.slice(0, -1).join(".")

      partialPath.push(partial)
      parsedExpands.set(completePath.join("."), {
        property: partial,
        serviceConfig: currentServiceConfig,
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

        // Merge the current expand into its parent
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
    const serviceConfig = this.getServiceConfig(
      queryObj.service,
      queryObj.alias
    )

    if (!serviceConfig) {
      if (queryObj.alias) {
        throw new Error(`Service with alias "${queryObj.alias}" was not found.`)
      }

      throw new Error(`Service "${queryObj.service}" was not found.`)
    }

    let pkName = serviceConfig.primaryKeys[0]
    const primaryKeyArg = queryObj.args?.find((arg) => {
      const inc = serviceConfig.primaryKeys.includes(arg.name)
      if (inc) {
        pkName = arg.name
      }
      return inc
    })
    const otherArgs = queryObj.args?.filter(
      (arg) => !serviceConfig.primaryKeys.includes(arg.name)
    )

    const implodeMapping: InternalImplodeMapping[] = []
    const parsedExpands = this.parseExpands(
      {
        property: "",
        parent: "",
        serviceConfig: serviceConfig,
        fields: queryObj.fields,
        args: otherArgs,
      },
      queryObj,
      serviceConfig,
      queryObj.expands!,
      implodeMapping
    )

    const root = parsedExpands.get(BASE_PATH)!

    const response = await this.fetchData(
      root,
      pkName,
      primaryKeyArg?.value,
      undefined,
      options
    )

    const data = response.path ? response.data[response.path!] : response.data

    await this.handleExpands(
      Array.isArray(data) ? data : [data],
      parsedExpands,
      implodeMapping,
      options
    )

    return response.data
  }
}
