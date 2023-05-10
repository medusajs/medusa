import { MedusaContainer } from "@medusajs/types"

export type Relationship = {
  alias: string
  foreignKey: string
  primaryKey: string
  serviceName: string
  inverse?: boolean // In an inverted relationship the foreign key is on the other service and the primary key is on the current service
}

export interface ServiceConfig {
  serviceName: string
  primaryKeys: string[]
  relationships: Relationship[]
}

export interface Argument {
  name: string
  value?: any
  field?: string
}

export interface RemoteJoinerQuery {
  service: string
  expands?: Array<{
    property: string
    fields: string[]
    args?: Argument[]
    relationships?: Relationship[]
  }>
  fields: string[]
  args?: Argument[]
}

type ParsedExpand = {
  property: string
  serviceConfig: ServiceConfig
  fields: string[]
  args?: Argument[]
}

const BASE_PATH = "_root"
export class RemoteJoiner {
  private serviceConfigs: ServiceConfig[]
  private serviceConfigCache: Map<string, ServiceConfig> = new Map()

  constructor(
    private container: MedusaContainer,
    serviceConfigs: ServiceConfig[]
  ) {
    this.serviceConfigs = this.createSelfReferences(serviceConfigs)
  }

  private createSelfReferences(serviceConfigs: ServiceConfig[]) {
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

  private findServiceConfig(serviceName: string): ServiceConfig | undefined {
    if (!this.serviceConfigCache.has(serviceName)) {
      const config = this.serviceConfigs.find(
        (config) => config.serviceName === serviceName
      )
      this.serviceConfigCache.set(serviceName, config!)
    }
    return this.serviceConfigCache.get(serviceName)
  }

  private async fetchData(
    serviceConfig: ServiceConfig,
    pkField: string,
    fields: string[],
    ids?: (string | string[])[],
    relationship?: any,
    args?: any[]
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

    const moduleRegistryName =
      serviceConfig.serviceName[0].toLowerCase() +
      serviceConfig.serviceName.slice(1) +
      "Service"
    const service = this.container.resolve(moduleRegistryName)

    // TODO: handle tuples when composite keys is used

    if (relationship) {
      relationship.inverse
        ? relationship.primaryKey
        : relationship.foreignKey.split(".").pop()!
    }

    const fieldsArray = pkField.split(",")

    const response = await service.list({
      fields,
      args,
      options: {
        [pkField]: uniqueIds,
      },
    })

    const filteredDataArray = response.data.map((data: any) => {
      return fields.reduce((filteredData: any, field: string) => {
        filteredData[field] = data[field]
        return filteredData
      }, {})
    })

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
      const fields = expand.fields
      const args = expand.args

      const parentServiceConfig = this.findServiceConfig(query.service)

      await this.expandProperty(
        items,
        parentServiceConfig!,
        expandedPath,
        fields,
        args,
        parsedExpands
      )

      const relationship = parentServiceConfig!.relationships.find(
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
    parentServiceConfig: ServiceConfig,
    fullPath: string,
    fields: string[],
    args?: Argument[],
    parsedExpands?: Map<string, ParsedExpand>
  ): Promise<void> {
    if (!parsedExpands || !parsedExpands.has(fullPath)) {
      return
    }

    const { property: currentProperty, serviceConfig: targetServiceConfig } =
      parsedExpands.get(fullPath)!

    const relationship = parentServiceConfig.relationships.find(
      (relation) => relation.alias === currentProperty
    )

    if (relationship) {
      await this.expandRelationshipProperty(
        items,
        targetServiceConfig,
        relationship,
        fields,
        args
      )
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
    targetServiceConfig: ServiceConfig,
    relationship: Relationship,
    fields: string[],
    args?: Argument[]
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
          fields = Array.from(
            new Set(fields.flatMap((field) => field.split(",")))
          )

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
      targetServiceConfig,
      field,
      fields,
      idsToFetch,
      relationship,
      args
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
    serviceConfig: ServiceConfig,
    expands: RemoteJoinerQuery["expands"]
  ): Map<string, ParsedExpand> {
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
    initialService: ParsedExpand,
    query: RemoteJoinerQuery,
    serviceConfig: ServiceConfig,
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
              parentExpand.fields.push(
                relationship.foreignKey.split(".").pop()!
              )
              parentExpand.fields = [...new Set(parentExpand.fields)]
            }

            if (fields) {
              fields.push(relationship.primaryKey)
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
    const nestedProps = new Map<string, string[]>()

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
          if (nestedProps.has(parentPath)) {
            const nProp = nestedProps.get(parentPath)!
            nProp.push(expand.property)
            nestedProps.set(parentPath, nProp)
          } else {
            nestedProps.set(parentPath, [expand.property])
          }

          const nestedPath = nestedProps.get(parentPath)?.join(".")
          parentExpand.fields = [
            ...new Set([
              ...parentExpand.fields!,
              ...expand.fields.map((field: string) => `${nestedPath}.${field}`),
            ]),
          ]

          parentExpand.args = [
            ...(parentExpand.args || []),
            ...(expand.args || []).map((arg: Argument) => ({
              ...arg,
              field: nestedPath,
            })),
          ]

          // Add the path to the mergedPaths map
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

  async join(query: RemoteJoinerQuery): Promise<any> {
    const serviceConfig = this.findServiceConfig(query.service)

    if (!serviceConfig) {
      throw new Error(`Service not found: ${query.service}`)
    }

    // TODO: support composite primary key
    let pkName = serviceConfig.primaryKeys[0]
    const primaryKeyArg = query.args?.find((arg) => {
      const inc = serviceConfig.primaryKeys.includes(arg.name)
      if (inc) {
        pkName = arg.name
      }
      return inc
    })
    const otherArgs = query.args?.filter(
      (arg) => !serviceConfig.primaryKeys.includes(arg.name)
    )

    const parsedExpands = this.parseExpands(
      {
        property: "",
        serviceConfig: serviceConfig,
        fields: query.fields,
        args: otherArgs,
      },
      query,
      serviceConfig,
      query.expands!
    )

    const root = parsedExpands.get(BASE_PATH)!
    const data = await this.fetchData(
      serviceConfig,
      pkName,
      root.fields,
      primaryKeyArg?.value,
      undefined,
      root.args || []
    )

    await this.handleExpands(
      Array.isArray(data) ? data : [data],
      query,
      parsedExpands
    )

    return data
  }
}
