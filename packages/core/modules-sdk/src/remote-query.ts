import {
  RemoteFetchDataCallback,
  RemoteJoiner,
  toRemoteJoinerQuery,
} from "@medusajs/orchestration"
import {
  JoinerArgument,
  JoinerRelationship,
  JoinerServiceConfig,
  LoadedModule,
  ModuleJoinerConfig,
  RemoteExpandProperty,
  RemoteJoinerOptions,
  RemoteJoinerQuery,
  RemoteNestedExpands,
} from "@medusajs/types"
import { isString, toPascalCase } from "@medusajs/utils"
import { MedusaModule } from "./medusa-module"

export class RemoteQuery {
  private remoteJoiner: RemoteJoiner
  private modulesMap: Map<string, LoadedModule> = new Map()
  private customRemoteFetchData?: RemoteFetchDataCallback

  constructor({
    modulesLoaded,
    customRemoteFetchData,
    servicesConfig = [],
  }: {
    modulesLoaded?: LoadedModule[]
    customRemoteFetchData?: RemoteFetchDataCallback
    servicesConfig?: ModuleJoinerConfig[]
  }) {
    const servicesConfig_ = [...servicesConfig]

    if (!modulesLoaded?.length) {
      modulesLoaded = MedusaModule.getLoadedModules().map(
        (mod) => Object.values(mod)[0]
      )
    }

    for (const mod of modulesLoaded || []) {
      if (!mod.__definition.isQueryable) {
        continue
      }

      const serviceName = mod.__definition.key

      if (this.modulesMap.has(serviceName)) {
        throw new Error(
          `Duplicated instance of module ${serviceName} is not allowed.`
        )
      }

      this.modulesMap.set(serviceName, mod)
      servicesConfig_!.push(mod.__joinerConfig)
    }

    this.customRemoteFetchData = customRemoteFetchData

    this.remoteJoiner = new RemoteJoiner(
      servicesConfig_ as JoinerServiceConfig[],
      this.remoteFetchData.bind(this),
      { autoCreateServiceNameAlias: false }
    )
  }

  public setFetchDataCallback(
    remoteFetchData: (
      expand: RemoteExpandProperty,
      keyField: string,
      ids?: (unknown | unknown[])[],
      relationship?: any
    ) => Promise<{
      data: unknown[] | { [path: string]: unknown[] }
      path?: string
    }>
  ): void {
    this.remoteJoiner.setFetchDataCallback(remoteFetchData)
  }

  public static getAllFieldsAndRelations(
    expand: RemoteExpandProperty | RemoteNestedExpands[number],
    prefix = "",
    args: JoinerArgument = {} as JoinerArgument
  ): {
    select?: string[]
    relations: string[]
    args: JoinerArgument
  } {
    expand = JSON.parse(JSON.stringify(expand))

    let fields: Set<string> = new Set()
    let relations: string[] = []

    let shouldSelectAll = false

    for (const field of expand.fields ?? []) {
      if (field === "*") {
        shouldSelectAll = true
        break
      }
      fields.add(prefix ? `${prefix}.${field}` : field)
    }

    args[prefix] = expand.args

    for (const property in expand.expands ?? {}) {
      const newPrefix = prefix ? `${prefix}.${property}` : property

      relations.push(newPrefix)
      fields.delete(newPrefix)

      const result = RemoteQuery.getAllFieldsAndRelations(
        expand.expands![property],
        newPrefix,
        args
      )

      result.select?.forEach(fields.add, fields)
      relations = relations.concat(result.relations)
    }

    const allFields = Array.from(fields)
    const select =
      allFields.length && !shouldSelectAll
        ? allFields
        : shouldSelectAll
        ? undefined
        : []
    return { select, relations, args }
  }

  private hasPagination(options: { [attr: string]: unknown }): boolean {
    if (!options) {
      return false
    }

    const attrs = ["skip", "cursor"]
    return Object.keys(options).some((key) => attrs.includes(key))
  }

  private buildPagination(options, count) {
    return {
      skip: options.skip,
      take: options.take,
      cursor: options.cursor,
      // TODO: next cursor
      count,
    }
  }

  public async remoteFetchData(
    expand: RemoteExpandProperty,
    keyField: string,
    ids?: (unknown | unknown[])[],
    relationship?: JoinerRelationship
  ): Promise<{
    data: unknown[] | { [path: string]: unknown }
    path?: string
  }> {
    if (this.customRemoteFetchData) {
      const resp = await this.customRemoteFetchData(expand, keyField, ids)
      if (resp !== undefined) {
        return resp
      }
    }

    const serviceConfig = expand.serviceConfig
    const service = this.modulesMap.get(serviceConfig.serviceName)!

    let filters = {}
    const options = {
      ...RemoteQuery.getAllFieldsAndRelations(expand),
    }

    const availableOptions = [
      "skip",
      "take",
      "limit",
      "offset",
      "cursor",
      "sort",
      "order",
      "withDeleted",
    ]
    const availableOptionsAlias = new Map([
      ["limit", "take"],
      ["offset", "skip"],
    ])

    for (const arg of expand.args || []) {
      if (arg.name === "filters" && arg.value) {
        filters = { ...filters, ...arg.value }
      } else if (arg.name === "context" && arg.value) {
        filters["context"] = arg.value
      } else if (availableOptions.includes(arg.name)) {
        const argName = availableOptionsAlias.has(arg.name)
          ? availableOptionsAlias.get(arg.name)!
          : arg.name
        options[argName] = arg.value
      }
    }

    if (ids) {
      filters[keyField] = ids
    }

    const hasPagination = this.hasPagination(options)

    let methodName = hasPagination ? "listAndCount" : "list"

    if (relationship?.args?.methodSuffix) {
      methodName += toPascalCase(relationship.args.methodSuffix)
    } else if (serviceConfig?.args?.methodSuffix) {
      methodName += toPascalCase(serviceConfig.args.methodSuffix)
    }

    if (typeof service[methodName] !== "function") {
      throw new Error(
        `Method "${methodName}" does not exist on "${serviceConfig.serviceName}"`
      )
    }

    const result = await service[methodName](filters, options)

    if (hasPagination) {
      const [data, count] = result
      return {
        data: {
          rows: data,
          metadata: this.buildPagination(options, count),
        },
        path: "rows",
      }
    }

    return {
      data: result,
    }
  }

  public async query(
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>,
    options?: RemoteJoinerOptions
  ): Promise<any> {
    let finalQuery: RemoteJoinerQuery = query as RemoteJoinerQuery

    if (isString(query)) {
      finalQuery = RemoteJoiner.parseQuery(query, variables)
    } else if (!isString(finalQuery?.service) && !isString(finalQuery?.alias)) {
      finalQuery = toRemoteJoinerQuery(query, variables)
    }

    return await this.remoteJoiner.query(finalQuery, options)
  }
}
