import {
  JoinerArgument,
  JoinerRelationship,
  JoinerServiceConfig,
  MedusaContainer,
  RemoteJoinerQuery,
} from "@medusajs/types"
import GraphQLParser from "./graphq-ast"

interface NestedExpands {
  [key: string]: {
    fields: string[]
    args?: JoinerArgument[]
    expands?: NestedExpands
  }
}

interface ParsedExpand {
  property: string
  serviceConfig: JoinerServiceConfig
  fields: string[]
  args?: JoinerArgument[]
  expands?: NestedExpands
}

const BASE_PATH = "_root"
export class RemoteJoiner {
  private serviceConfigs: JoinerServiceConfig[]
  private serviceConfigCache: Map<string, JoinerServiceConfig> = new Map()

  constructor(
    private container: MedusaContainer,
    serviceConfigs: JoinerServiceConfig[]
  ) {
    this.serviceConfigs = this.createSelfReferences(serviceConfigs)
  }

  private createSelfReferences(serviceConfigs: JoinerServiceConfig[]) {
    for (const service of serviceConfigs) {
      const propName = service.serviceName.toLowerCase()
      service.relationships.push({
        alias: propName,
        foreignKey: propName + "_id",
        primaryKey: "id",
        serviceName: service.serviceName,
      })
    }

    return serviceConfigs
  }

  private findServiceConfig(
    serviceName: string
  ): JoinerServiceConfig | undefined {
    if (!this.serviceConfigCache.has(serviceName)) {
      const config = this.serviceConfigs.find(
        (config) => config.serviceName === serviceName
      )
      this.serviceConfigCache.set(serviceName, config!)
    }
    return this.serviceConfigCache.get(serviceName)
  }

  private async fetchData(
    expand: ParsedExpand,
    pkField: string,
    ids?: (string | string[])[],
    relationship?: any
  ): Promise<any> {
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

    const serviceConfig = expand.serviceConfig
    const moduleRegistryName =
      serviceConfig.serviceName[0].toLowerCase() +
      serviceConfig.serviceName.slice(1) +
      "Service"
    const service = this.container.resolve(moduleRegistryName)

    if (relationship) {
      pkField = relationship.inverse
        ? relationship.foreignKey.split(".").pop()!
        : relationship.primaryKey
    }

    const methodName = relationship?.inverse
      ? `getBy${this.toPascalCase(pkField)}`
      : "list"

    console.log(
      moduleRegistryName,
      methodName,
      JSON.stringify(
        {
          fields: expand.fields,
          args: expand.args,
          expands: expand.expands,
          options: {
            [pkField]: uniqueIds,
          },
        },
        null,
        2
      ),
      "------------------------------"
    )

    const response = await service[methodName]({
      fields: expand.fields,
      args: expand.args,
      expands: expand.expands,
      options: {
        [pkField]: uniqueIds,
      },
    })

    const filterFields = (
      data: any,
      fields: string[],
      expands?: NestedExpands
    ): any => {
      const filteredData = fields.reduce((acc: any, field: string) => {
        acc[field] = data[field]
        return acc
      }, {})

      if (expands) {
        for (const key in expands) {
          const expand = expands[key]
          filteredData[key] = filterFields(
            data[key],
            expand.fields,
            expand.expands
          )
        }
      }

      return filteredData
    }

    const filteredDataArray = response.map((data: any) =>
      filterFields(data, expand.fields, expand.expands)
    )

    return filteredDataArray
  }

  private getNestedItems(items: any[], property: string): any[] {
    return items
      .flatMap((item) => item[property])
      .filter((item) => item !== undefined)
  }

  private async handleExpands(
    items: any[],
    query: RemoteJoinerQuery,
    parsedExpands: Map<string, any>,
    basePath: string = BASE_PATH,
    resolvedPaths: Set<string> = new Set()
  ): Promise<void> {
    if (!parsedExpands) {
      return
    }

    for (const [expandedPath, expand] of parsedExpands.entries()) {
      const isImmediateChildPath =
        expandedPath.startsWith(basePath) &&
        expandedPath.split(".").length === basePath.split(".").length + 1

      if (!isImmediateChildPath || resolvedPaths.has(expandedPath)) {
        continue
      }

      resolvedPaths.add(expandedPath)

      const property = expand.property || ""

      const parentServiceConfig = this.findServiceConfig(query.service)

      await this.expandProperty(items, parentServiceConfig!, expand)

      const relationship = parentServiceConfig?.relationships?.find(
        (relation) => relation.alias === property
      )

      const nestedItems = this.getNestedItems(items, property)

      if (nestedItems.length === 0) {
        return
      }

      const nextProp = relationship
        ? {
            ...query,
            service: relationship.serviceName,
          }
        : query

      await this.handleExpands(
        nestedItems,
        nextProp,
        parsedExpands,
        expandedPath,
        resolvedPaths
      )
    }
  }

  private async expandProperty(
    items: any[],
    parentServiceConfig: JoinerServiceConfig,
    expand?: ParsedExpand
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

  private createRelatedDataMap(
    relatedDataArray: any[],
    joinFields: string[]
  ): Record<string, any> {
    return relatedDataArray.reduce((acc, data) => {
      const joinValues = joinFields.map((field) => data[field])
      const key = joinValues.length === 1 ? joinValues[0] : joinValues.join(",")

      let isArray = Array.isArray(acc[key])
      if (typeof acc[key] !== "undefined" && !isArray) {
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

  private async expandRelationshipProperty(
    items: any[],
    expand: ParsedExpand,
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

    const relatedDataMap = this.createRelatedDataMap(
      relatedDataArray,
      joinFields
    )

    items.forEach((item) => {
      if (!item[relationship.alias]) {
        const itemKey = fieldsArray.map((field) => item[field]).join(",")

        if (Array.isArray(item[field])) {
          item[relationship.alias] = item[field]
            .map((id) => relatedDataMap[id])
            .filter((relatedItem) => relatedItem !== undefined)
        } else {
          item[relationship.alias] = relatedDataMap[itemKey]
        }
      }
    })
  }

  private parseExpands(
    initialService: ParsedExpand,
    query: RemoteJoinerQuery,
    serviceConfig: JoinerServiceConfig,
    expands: RemoteJoinerQuery["expands"]
  ): Map<string, ParsedExpand> {
    const parsedExpands = this.parseProperties(
      initialService,
      query,
      serviceConfig,
      expands
    )

    // TODO: group can be configurable
    const groupedExpands = this.groupExpands(parsedExpands)
    return groupedExpands
  }

  private parseProperties(
    initialService: ParsedExpand,
    query: RemoteJoinerQuery,
    serviceConfig: JoinerServiceConfig,
    expands: RemoteJoinerQuery["expands"]
  ): Map<string, ParsedExpand> {
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

              parentExpand.fields = parentExpand.fields.concat(
                relField.split(",")
              )
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

          currentServiceConfig = this.findServiceConfig(
            relationship.serviceName
          )

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
    parsedExpands: Map<string, ParsedExpand>
  ): Map<string, ParsedExpand> {
    const sortedParsedExpands = new Map(
      Array.from(parsedExpands.entries()).sort()
    )

    const mergedExpands = new Map<string, ParsedExpand>()
    const mergedPaths = new Map<string, string>()
    const nestedProps = new Map<string, ParsedExpand>()

    for (const [path, expand] of sortedParsedExpands.entries()) {
      const currentServiceName = expand.serviceConfig.serviceName

      let parentPath = path.split(".").slice(0, -1).join(".")

      // Check if the parentPath was merged before
      while (mergedPaths.has(parentPath)) {
        parentPath = mergedPaths.get(parentPath)!
      }

      const canMerge = expand.fields?.every((field: string) => {
        const nestedPath = [path, field].join(".")
        const nestedExpand = parsedExpands.get(nestedPath)
        return (
          !nestedExpand ||
          nestedExpand.serviceConfig.serviceName === currentServiceName
        )
      })

      if (mergedExpands.has(parentPath) && canMerge) {
        const parentExpand = mergedExpands.get(parentPath)!

        if (parentExpand.serviceConfig.serviceName === currentServiceName) {
          if (!parentExpand.expands) {
            parentExpand.expands = {}
          }

          parentExpand.expands[expand.property] = {
            fields: expand.fields,
            args: expand.args,
          }
          mergedPaths.set(path, parentPath)
        } else {
          mergedExpands.set(path, expand)
        }
      } else {
        mergedExpands.set(path, expand)
      }
    }
    return mergedExpands
  }

  static parseQuery(graphqlQuery: string, variables?: any): RemoteJoinerQuery {
    const parser = new GraphQLParser(graphqlQuery, variables)
    return parser.parseQuery()
  }

  private toPascalCase(s: string): string {
    return s.replace(/(^\w|_\w)/g, (match) =>
      match.replace(/_/g, "").toUpperCase()
    )
  }

  async query(queryObj: RemoteJoinerQuery): Promise<any> {
    queryObj.service = this.toPascalCase(queryObj.service)
    const serviceConfig = this.findServiceConfig(queryObj.service)

    if (!serviceConfig) {
      throw new Error(`Service not found: ${queryObj.service}`)
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

    const data = await this.fetchData(
      root,
      pkName,
      primaryKeyArg?.value,
      undefined
    )

    await this.handleExpands(
      Array.isArray(data) ? data : [data],
      queryObj,
      parsedExpands
    )

    return data
  }
}
