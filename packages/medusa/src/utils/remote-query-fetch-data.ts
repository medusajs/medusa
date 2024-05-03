import { MedusaModule, RemoteQuery } from "@medusajs/modules-sdk"
import { MedusaContainer } from "@medusajs/types"

function hasPagination(options: { [attr: string]: unknown }): boolean {
  if (!options) {
    return false
  }

  const attrs = ["skip"]
  return Object.keys(options).some((key) => attrs.includes(key))
}

function buildPagination(options, count) {
  return {
    skip: options.skip,
    take: options.take,
    count,
  }
}

export function remoteQueryFetchData(container: MedusaContainer) {
  return async (expand, keyField, ids, relationship) => {
    const serviceConfig = expand.serviceConfig
    const service = container.resolve(serviceConfig.serviceName, {
      allowUnregistered: true,
    })

    if (MedusaModule.isInstalled(serviceConfig.serviceName)) {
      return
    }

    let filters = {}
    const options = {
      ...RemoteQuery.getAllFieldsAndRelations(expand),
    }

    const availableOptions = [
      "skip",
      "take",
      "limit",
      "offset",
      "order",
      "sort",
      "withDeleted",
    ]
    const availableOptionsAlias = new Map([
      ["limit", "take"],
      ["offset", "skip"],
      ["sort", "order"],
    ])
    for (const arg of expand.args || []) {
      if (arg.name === "filters" && arg.value) {
        filters = { ...arg.value }
      } else if (availableOptions.includes(arg.name)) {
        const argName = availableOptionsAlias.has(arg.name)
          ? availableOptionsAlias.get(arg.name)
          : arg.name
        options[argName] = arg.value
      }
    }
    const expandRelations = Object.keys(expand.expands ?? {})

    // filter out links from relations because TypeORM will throw if the relation doesn't exist

    options.relations = options.relations.filter(
      (relation) => !expandRelations.some((ex) => relation.startsWith(ex))
    )

    options.select = options.relations.filter(
      (field) => !expandRelations.some((ex) => field.startsWith(ex))
    )

    if (ids) {
      filters[keyField] = ids
    }

    const hasPagination_ = hasPagination(options)

    let methodName = hasPagination_ ? "listAndCount" : "list"

    if (relationship?.args?.methodSuffix) {
      methodName += relationship.args.methodSuffix
    } else if (serviceConfig?.args?.methodSuffix) {
      methodName += serviceConfig.args.methodSuffix
    }

    const result = await service[methodName](filters, options)

    if (hasPagination_) {
      const [data, count] = result
      return {
        data: {
          rows: data,
          metadata: buildPagination(options, count),
        },
        path: "rows",
      }
    }

    return {
      data: result,
    } as any
  }
}
