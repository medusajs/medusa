import { MedusaModule, RemoteQuery } from "@medusajs/modules-sdk"
import { MedusaContainer } from "@medusajs/types"

export function remoteQueryFetchData(container: MedusaContainer) {
  return async (expand, keyField, ids, relationship) => {
    const serviceConfig = expand.serviceConfig
    const service = container.resolve(serviceConfig.serviceName, {
      allowUnregistered: true,
    })

    if (MedusaModule.isInstalled(serviceConfig.serviceName)) {
      return
    }

    const filters = {}
    const options = {
      ...RemoteQuery.getAllFieldsAndRelations(expand),
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

    const hasPagination = Object.keys(options).some((key) =>
      ["skip"].includes(key)
    )

    let methodName = hasPagination ? "listAndCount" : "list"

    if (relationship?.args?.methodSuffix) {
      methodName += relationship.args.methodSuffix
    } else if (serviceConfig?.args?.methodSuffix) {
      methodName += serviceConfig.args.methodSuffix
    }

    const result = await service[methodName](filters, options)

    if (hasPagination) {
      const [data, count] = result
      return {
        data: {
          rows: data,
          metadata: {},
        },
        path: "rows",
      }
    }

    return {
      data: result,
    } as any
  }
}
