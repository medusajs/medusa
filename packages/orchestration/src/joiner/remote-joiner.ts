import {
  JoinerRelationship,
  JoinerServiceConfig,
  JoinerServiceConfigAlias,
  ModuleJoinerConfig,
  RemoteExpandProperty,
  RemoteJoinerQuery,
  RemoteNestedExpands,
} from "@medusajs/types"

import { isDefined } from "@medusajs/utils"
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

export class RemoteJoiner {
  private serviceConfigCache: Map<string, JoinerServiceConfig> = new Map()

  private static filterFields(
    data: any,
    fields: string[],
    expands?: RemoteNestedExpands
  ): Record<string, unknown> {
    if (!fields || !data) {
      return data
    }

    const filteredData = fields.reduce((acc: any, field: string) => {
      const fieldValue = data?.[field]

      if (isDefined(fieldValue)) {
        acc[field] = data?.[field]
      }

      return acc
    }, {})

    if (expands) {
      for (const key in expands) {
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
    return items
      .flatMap((item) => item[property])
      .filter((item) => item !== undefined)
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
    private remoteFetchData: RemoteFetchDataCallback
  ) {
    this.serviceConfigs = this.buildReferences(serviceConfigs)
  }

  public setFetchDataCallback(remoteFetchData: RemoteFetchDataCallback): void {
    this.remoteFetchData = remoteFetchData
  }

  private buildReferences(serviceConfigs: ModuleJoinerConfig[]) {
    const expandedRelationships: Map<string, JoinerRelationship[]> = new Map()
    for (const service of serviceConfigs) {
      if (this.serviceConfigCache.has(service.serviceName!)) {
        throw new Error(`Service "${service.serviceName}" is already defined.`)
      }

      if (!service.relationships) {
        service.relationships = []
      }

      // add aliases
      const isReadOnlyDefinition =
        service.serviceName === undefined || service.isReadOnlyLink
      if (!isReadOnlyDefinition) {
        if (!service.alias) {
          service.alias = [{ name: service.serviceName!.toLowerCase() }]
        } else if (!Array.isArray(service.alias)) {
          service.alias = [service.alias]
        }

        // self-reference
        for (const alias of service.alias) {
          if (this.serviceConfigCache.has(`alias_${alias.name}}`)) {
            const defined = this.serviceConfigCache.get(`alias_${alias.name}}`)
            throw new Error(
              `Cannot add alias "${alias.name}" for "${service.serviceName}". It is already defined for Service "${defined?.serviceName}".`
            )
          }

          const args =
            service.args || alias.args
              ? { ...service.args, ...alias.args }
              : undefined

          service.relationships?.push({
            alias: alias.name,
            foreignKey: alias.name + "_id",
            primaryKey: "id",
            serviceName: service.serviceName!,
            args,
          })
          this.cacheServiceConfig(serviceConfigs, undefined, alias.name)
        }

        this.cacheServiceConfig(serviceConfigs, service.serviceName)
      }

      if (!service.extends) {
        continue
      }

      for (const extend of service.extends) {
        if (!expandedRelationships.has(extend.serviceName)) {
          expandedRelationships.set(extend.serviceName, [])
        }

        expandedRelationships.get(extend.serviceName)!.push(extend.relationship)
      }
    }

    for (const [serviceName, relationships] of expandedRelationships) {
      if (!this.serviceConfigCache.has(serviceName)) {
        throw new Error(`Service "${serviceName}" was not found`)
      }

      const service = this.serviceConfigCache.get(serviceName)
      service!.relationships?.push(...relationships)
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
    relationship?: any
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
    const resData = isObj ? response.data[response.path!] : response.data

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

  private async handleExpands(
    items: any[],
    query: RemoteJoinerQuery,
    parsedExpands: Map<string, RemoteExpandProperty>
  ): Promise<void> {
    if (!parsedExpands) {
      return
    }
    const resolvedPaths = new Set<string>()
    const stack: [any[], Partial<RemoteJoinerQuery>, string][] = [
      [items, query, BASE_PATH],
    ]

    while (stack.length > 0) {
      const [currentItems, currentQuery, basePath] = stack.pop()!

      for (const [expandedPath, expand] of parsedExpands.entries()) {
        const isParentPath = expandedPath.startsWith(basePath)

        if (!isParentPath || resolvedPaths.has(expandedPath)) {
          continue
        }

        resolvedPaths.add(expandedPath)
        const property = expand.property || ""

        let curItems = currentItems
        const expandedPathLevels = expandedPath.split(".")
        for (let idx = 1; idx < expandedPathLevels.length - 1; idx++) {
          curItems = RemoteJoiner.getNestedItems(
            curItems,
            expandedPathLevels[idx]
          )
        }

        await this.expandProperty(curItems, expand.parentConfig!, expand)
        const nestedItems = RemoteJoiner.getNestedItems(currentItems, property)

        if (nestedItems.length > 0) {
          const relationship = expand.serviceConfig
          let nextProp = currentQuery
          if (relationship) {
            const relQuery = {
              service: relationship.serviceName,
            }
            nextProp = relQuery
          }
          stack.push([nestedItems, nextProp, expandedPath])
        }
      }
    }
  }

  private async expandProperty(
    items: any[],
    parentServiceConfig: JoinerServiceConfig,
    expand?: RemoteExpandProperty
  ): Promise<void> {
    if (!expand) {
      return
    }

    const relationship = parentServiceConfig?.relationships?.find(
      (relation) => relation.alias === expand.property
    )

    if (relationship) {
      await this.expandRelationshipProperty(items, expand, relationship)
    }
  }

  private async expandRelationshipProperty(
    items: any[],
    expand: RemoteExpandProperty,
    relationship: JoinerRelationship
  ): Promise<void> {
    const field = relationship.inverse
      ? relationship.primaryKey
      : relationship.foreignKey.split(".").pop()!
    const fieldsArray = field.split(",")

    const idsToFetch: any[] = []

    items.forEach((item) => {
      const values = fieldsArray
        .map((field) => item[field])
        .filter((value) => value !== undefined)

      if (values.length === fieldsArray.length && !item[relationship.alias]) {
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
      relationship
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
      if (!item[relationship.alias]) {
        const itemKey = fieldsArray.map((field) => item[field]).join(",")

        if (Array.isArray(item[field])) {
          item[relationship.alias] = item[field]
            .map((id) => {
              if (relationship.isList && !Array.isArray(relatedDataMap[id])) {
                relatedDataMap[id] =
                  relatedDataMap[id] !== undefined ? [relatedDataMap[id]] : []
              }

              return relatedDataMap[id]
            })
            .filter((relatedItem) => relatedItem !== undefined)
        } else {
          if (relationship.isList && !Array.isArray(relatedDataMap[itemKey])) {
            relatedDataMap[itemKey] =
              relatedDataMap[itemKey] !== undefined
                ? [relatedDataMap[itemKey]]
                : []
          }

          item[relationship.alias] = relatedDataMap[itemKey]
        }
      }
    })
  }

  private parseExpands(
    initialService: RemoteExpandProperty,
    query: RemoteJoinerQuery,
    serviceConfig: JoinerServiceConfig,
    expands: RemoteJoinerQuery["expands"]
  ): Map<string, RemoteExpandProperty> {
    const parsedExpands = this.parseProperties(
      initialService,
      query,
      serviceConfig,
      expands
    )

    const groupedExpands = this.groupExpands(parsedExpands)

    return groupedExpands
  }

  private parseProperties(
    initialService: RemoteExpandProperty,
    query: RemoteJoinerQuery,
    serviceConfig: JoinerServiceConfig,
    expands: RemoteJoinerQuery["expands"]
  ): Map<string, RemoteExpandProperty> {
    const parsedExpands = new Map<string, any>()
    parsedExpands.set(BASE_PATH, initialService)

    for (const expand of expands || []) {
      const properties = expand.property.split(".")
      let currentServiceConfig = serviceConfig as any
      const currentPath: string[] = []

      for (const prop of properties) {
        const fullPath = [BASE_PATH, ...currentPath, prop].join(".")
        const relationship = currentServiceConfig.relationships.find(
          (relation) => relation.alias === prop
        )

        let fields: string[] | undefined =
          fullPath === BASE_PATH + "." + expand.property
            ? expand.fields
            : undefined
        const args =
          fullPath === BASE_PATH + "." + expand.property
            ? expand.args
            : undefined

        if (relationship) {
          const parentExpand =
            parsedExpands.get([BASE_PATH, ...currentPath].join(".")) || query

          if (parentExpand) {
            if (parentExpand.fields) {
              const relField = relationship.inverse
                ? relationship.primaryKey
                : relationship.foreignKey.split(".").pop()!

              parentExpand.fields = parentExpand.fields
                .concat(relField.split(","))
                .filter((field) => field !== relationship.alias)

              parentExpand.fields = [...new Set(parentExpand.fields)]
            }

            if (fields) {
              const relField = relationship.inverse
                ? relationship.foreignKey.split(".").pop()!
                : relationship.primaryKey
              fields = fields.concat(relField.split(","))

              fields = [...new Set(fields)]
            }
          }

          currentServiceConfig = this.getServiceConfig(relationship.serviceName)

          if (!currentServiceConfig) {
            throw new Error(
              `Target service not found: ${relationship.serviceName}`
            )
          }
        }

        if (!parsedExpands.has(fullPath)) {
          const parentPath = [BASE_PATH, ...currentPath].join(".")
          parsedExpands.set(fullPath, {
            property: prop,
            serviceConfig: currentServiceConfig,
            fields,
            args,
            parent: parentPath,
            parentConfig: parsedExpands.get(parentPath).serviceConfig,
          })
        }

        currentPath.push(prop)
      }
    }
    return parsedExpands
  }

  private groupExpands(
    parsedExpands: Map<string, RemoteExpandProperty>
  ): Map<string, RemoteExpandProperty> {
    const mergedExpands = new Map<string, RemoteExpandProperty>(parsedExpands)
    const mergedPaths = new Map<string, string>()

    for (const [path, expand] of mergedExpands.entries()) {
      const currentServiceName = expand.serviceConfig.serviceName
      let parentPath = expand.parent

      while (parentPath) {
        const parentExpand = mergedExpands.get(parentPath)
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

        targetExpand.fields = expand.fields
        targetExpand.args = expand.args

        mergedExpands.delete(path)
        mergedPaths.set(path, parentPath)

        parentPath = parentExpand.parent
      }
    }

    return mergedExpands
  }

  async query(queryObj: RemoteJoinerQuery): Promise<any> {
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
      queryObj.expands!
    )

    const root = parsedExpands.get(BASE_PATH)!

    const response = await this.fetchData(
      root,
      pkName,
      primaryKeyArg?.value,
      undefined
    )

    const data = response.path ? response.data[response.path!] : response.data

    await this.handleExpands(
      Array.isArray(data) ? data : [data],
      queryObj,
      parsedExpands
    )

    return response.data
  }
}
