import {
  JoinerRelationship,
  JoinerServiceConfig,
  JoinerServiceConfigAlias,
  RemoteExpandProperty,
  RemoteJoinerQuery,
  RemoteNestedExpands,
} from "@medusajs/types"
import { isDefined } from "@medusajs/utils"
import GraphQLParser from "./graphql-ast"

const BASE_PATH = "_root"
export class RemoteJoiner {
  private serviceConfigCache: Map<string, JoinerServiceConfig> = new Map()

  private static filterFields(
    data: any,
    fields: string[],
    expands?: RemoteNestedExpands
  ): Record<string, unknown> {
    if (!fields) {
      return data
    }

    const filteredData = fields.reduce((acc: any, field: string) => {
      acc[field] = data?.[field]
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
            filteredData[key] = RemoteJoiner.filterFields(
              data[key],
              expand.fields,
              expand.expands
            )
          }
        }
      }
    }

    return filteredData
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

  static parseQuery(graphqlQuery: string, variables?: any): RemoteJoinerQuery {
    const parser = new GraphQLParser(graphqlQuery, variables)
    return parser.parseQuery()
  }

  constructor(
    private serviceConfigs: JoinerServiceConfig[],
    private remoteFetchData: (
      expand: RemoteExpandProperty,
      keyField: string,
      ids?: (unknown | unknown[])[],
      relationship?: any
    ) => Promise<{
      data: unknown[] | { [path: string]: unknown }
      path?: string
    }>
  ) {
    this.serviceConfigs = this.buildReferences(serviceConfigs)
  }

  public setFetchDataCallback(
    remoteFetchData: (
      expand: RemoteExpandProperty,
      keyField: string,
      ids?: (unknown | unknown[])[],
      relationship?: any
    ) => Promise<{
      data: unknown[] | { [path: string]: unknown }
      path?: string
    }>
  ): void {
    this.remoteFetchData = remoteFetchData
  }

  private buildReferences(serviceConfigs: JoinerServiceConfig[]) {
    const expandedRelationships: Map<string, JoinerRelationship[]> = new Map()
    for (const service of serviceConfigs) {
      if (this.serviceConfigCache.has(service.serviceName)) {
        throw new Error(`Service "${service.serviceName}" is already defined.`)
      }

      if (!service.relationships) {
        service.relationships = []
      }

      // add aliases
      if (!service.alias) {
        service.alias = [{ name: service.serviceName.toLowerCase() }]
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
          serviceName: service.serviceName,
          args,
        })
        this.cacheServiceConfig(serviceConfigs, undefined, alias.name)
      }

      this.cacheServiceConfig(serviceConfigs, service.serviceName)

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

    const stack: [
      any[],
      Partial<RemoteJoinerQuery>,
      Map<string, RemoteExpandProperty>,
      string,
      Set<string>
    ][] = [[items, query, parsedExpands, "", new Set()]]

    while (stack.length > 0) {
      const [
        currentItems,
        currentQuery,
        currentParsedExpands,
        basePath,
        resolvedPaths,
      ] = stack.pop()!

      for (const [expandedPath, expand] of currentParsedExpands.entries()) {
        const isImmediateChildPath =
          expandedPath.startsWith(basePath) &&
          expandedPath.split(".").length === basePath.split(".").length + 1

        if (!isImmediateChildPath || resolvedPaths.has(expandedPath)) {
          continue
        }

        resolvedPaths.add(expandedPath)

        const property = expand.property || ""
        const parentServiceConfig = this.getServiceConfig(
          currentQuery.service,
          currentQuery.alias
        )

        await this.expandProperty(currentItems, parentServiceConfig!, expand)

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

          stack.push([
            nestedItems,
            nextProp,
            currentParsedExpands,
            expandedPath,
            new Set(),
          ])
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
                relatedDataMap[id] = [relatedDataMap[id]]
              }

              return relatedDataMap[id]
            })
            .filter((relatedItem) => relatedItem !== undefined)
        } else {
          if (relationship.isList && !Array.isArray(relatedDataMap[itemKey])) {
            relatedDataMap[itemKey] = [relatedDataMap[itemKey]]
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
          parsedExpands.set(fullPath, {
            property: prop,
            serviceConfig: currentServiceConfig,
            fields,
            args,
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
    const sortedParsedExpands = new Map(
      Array.from(parsedExpands.entries()).sort()
    )

    const mergedExpands = new Map<string, RemoteExpandProperty>(
      sortedParsedExpands
    )
    const mergedPaths = new Map<string, string>()

    let lastServiceName = ""

    for (const [path, expand] of sortedParsedExpands.entries()) {
      const currentServiceName = expand.serviceConfig.serviceName

      let parentPath = path.split(".").slice(0, -1).join(".")

      // Check if the parentPath was merged before
      while (mergedPaths.has(parentPath)) {
        parentPath = mergedPaths.get(parentPath)!
      }

      const canMerge = currentServiceName === lastServiceName

      if (mergedExpands.has(parentPath) && canMerge) {
        const parentExpand = mergedExpands.get(parentPath)!

        if (parentExpand.serviceConfig.serviceName === currentServiceName) {
          const nestedKeys = path.split(".").slice(parentPath.split(".").length)
          let targetExpand: any = parentExpand

          for (let key of nestedKeys) {
            if (!targetExpand.expands) {
              targetExpand.expands = {}
            }
            if (!targetExpand.expands[key]) {
              targetExpand.expands[key] = {} as any
            }
            targetExpand = targetExpand.expands[key]
          }

          targetExpand.fields = expand.fields
          targetExpand.args = expand.args
          mergedPaths.set(path, parentPath)
        }
      } else {
        lastServiceName = currentServiceName
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
