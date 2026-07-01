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
import { isPresent, isString, toPascalCase } from "@medusajs/utils"
import { MedusaModule } from "../medusa-module"
import {
  RemoteFetchDataCallback,
  RemoteJoiner,
  toRemoteJoinerQuery,
} from "../joiner"

const BASE_PREFIX = ""
const MAX_BATCH_SIZE = 4000
const MAX_CONCURRENT_REQUESTS = 10
export class RemoteQuery {
  private remoteJoiner: RemoteJoiner
  private modulesMap: Map<string, LoadedModule> = new Map()
  private customRemoteFetchData?: RemoteFetchDataCallback
  private entitiesMap: Map<string, any> = new Map()

  static traceFetchRemoteData?: (
    fetcher: () => Promise<any>,
    serviceName: string,
    method: string,
    options: { select?: string[]; relations: string[] }
  ) => Promise<any>

  constructor({
    modulesLoaded,
    customRemoteFetchData,
    servicesConfig = [],
    entitiesMap,
  }: {
    modulesLoaded?: LoadedModule[]
    customRemoteFetchData?: RemoteFetchDataCallback
    servicesConfig?: ModuleJoinerConfig[]
    entitiesMap: Map<string, any>
  }) {
    const servicesConfig_ = [...servicesConfig]
    this.entitiesMap = entitiesMap

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
      {
        autoCreateServiceNameAlias: false,
        entitiesMap,
      }
    )
  }

  public getEntitiesMap() {
    return this.entitiesMap
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
    prefix = BASE_PREFIX,
    args: JoinerArgument = {} as JoinerArgument
  ): {
    select?: string[]
    relations: string[]
    args: JoinerArgument
    take?: number | null
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

    const filters =
      expand.args?.find((arg) => arg.name === "filters")?.value ?? {}

    if (isPresent(filters)) {
      args[prefix] = filters
    } else if (isPresent(expand.args)) {
      args[prefix] = expand.args
    }

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

    return {
      select,
      relations,
      args,
    }
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
      // cursor: options.cursor, not yet supported
      // TODO: next cursor
      count,
    }
  }

  private async fetchRemoteDataBatched(args: {
    serviceName: string
    keyField: string
    service: any
    methodName: string
    filters: any
    options: any
    ids: (unknown | unknown[])[]
  }): Promise<any[]> {
    const {
      serviceName,
      keyField,
      service,
      methodName,
      filters,
      options,
      ids,
    } = args

    const getBatch = function* (
      idArray: (unknown | unknown[])[],
      batchSize: number
    ) {
      for (let i = 0; i < idArray.length; i += batchSize) {
        yield idArray.slice(i, i + batchSize)
      }
    }

    const idsToFetch = getBatch(ids, MAX_BATCH_SIZE)
    const results: any[] = []
    let running = 0
    const fetchPromises: Promise<void>[] = []

    const processBatch = async (batch: (unknown | unknown[])[]) => {
      running++
      const batchFilters = { ...filters, [keyField]: batch }
      let result

      try {
        if (RemoteQuery.traceFetchRemoteData) {
          result = await RemoteQuery.traceFetchRemoteData(
            async () => service[methodName](batchFilters, options),
            serviceName,
            methodName,
            options
          )
        } else {
          result = await service[methodName](batchFilters, options)
        }
        results.push(result)
      } finally {
        running--
        processAllBatches()
      }
    }

    let batchesDone: (value: void) => void = () => {}
    const awaitBatches = new Promise((ok) => {
      batchesDone = ok
    })
    const processAllBatches = async () => {
      let isDone = false
      while (running < MAX_CONCURRENT_REQUESTS) {
        const nextBatch = idsToFetch.next()
        if (nextBatch.done) {
          isDone = true
          break
        }

        const batch = nextBatch.value
        fetchPromises.push(processBatch(batch))
      }

      if (isDone) {
        await Promise.all(fetchPromises)
        batchesDone()
      }
    }

    processAllBatches()
    await awaitBatches

    const flattenedResults = results.reduce((acc, result) => {
      if (
        Array.isArray(result) &&
        result.length === 2 &&
        Array.isArray(result[0])
      ) {
        return acc.concat(result[0])
      }
      return acc.concat(result)
    }, [])

    return flattenedResults
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

    return this.executeFetchRequest({
      expand,
      keyField,
      ids,
      relationship,
    })
  }

  private async executeFetchRequest(params: {
    expand: RemoteExpandProperty
    keyField: string
    ids?: (unknown | unknown[])[] | object
    relationship?: JoinerRelationship
  }): Promise<{
    data: unknown[] | { [path: string]: unknown }
    path?: string
  }> {
    const { expand, keyField, ids, relationship } = params
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
      "options",
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

    delete options.args?.[BASE_PREFIX]
    if (Object.keys(options.args ?? {}).length) {
      filters = {
        ...filters,
        ...options?.args,
      }
      options.args = {} as any
    }

    const hasPagination = this.hasPagination(options)
    const isIdsArray = Array.isArray(ids)
    const idsLength = isIdsArray ? ids.length : 1

    if (ids) {
      if (isIdsArray && !idsLength) {
        if (hasPagination) {
          return {
            data: {
              rows: [],
              metadata: this.buildPagination(options, 0),
            },
            path: "rows",
          }
        } else {
          return {
            data: [],
          }
        }
      }

      filters[keyField] = ids
    }

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

    if (isIdsArray && idsLength && !hasPagination) {
      options.take = null
    }

    if (isIdsArray && idsLength >= MAX_BATCH_SIZE && !hasPagination) {
      const data = await this.fetchRemoteDataBatched({
        serviceName: serviceConfig.serviceName,
        keyField,
        service,
        methodName,
        filters,
        options,
        ids,
      })
      return { data }
    }

    let result: any
    if (RemoteQuery.traceFetchRemoteData) {
      result = await RemoteQuery.traceFetchRemoteData(
        async () => service[methodName](filters, options),
        serviceConfig.serviceName,
        methodName,
        options
      )
    } else {
      result = await service[methodName](filters, options)
    }

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
