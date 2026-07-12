import {
  ModuleJoinerConfig,
  RemoteJoinerOptions,
  RemoteJoinerQuery,
} from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { GraphCatalog } from "./catalog"
import { compileQuery } from "./compile"
import { executePlan } from "./execute"
import { IRemoteDataFetcher, RelationMap } from "./types"

export type { RelationMap } from "./types"

/**
 * Executes cross-module graph queries by resolving relationships from module
 * joiner configs.
 *
 * Pipeline: {@link GraphCatalog} (index configs) → {@link compileQuery}
 * (query → plan) → {@link executePlan} (fetch + join + shortcuts).
 *
 * Data loading is delegated to {@link IRemoteDataFetcher} (typically
 * ModuleDataFetcher). Query is the public entry point that normalizes user
 * input and invokes {@link RemoteJoiner.query}.
 */
export class RemoteJoiner {
  private catalog: GraphCatalog

  constructor(
    serviceConfigs: ModuleJoinerConfig[],
    private dataFetcher: IRemoteDataFetcher,
    options: {
      autoCreateServiceNameAlias?: boolean
      relationMap?: RelationMap
    } = {}
  ) {
    this.catalog = new GraphCatalog(serviceConfigs, options)
  }

  async query(
    queryObj: RemoteJoinerQuery,
    options?: RemoteJoinerOptions
  ): Promise<any> {
    const serviceConfig = this.catalog.getServiceConfig({
      serviceName: queryObj.service,
      serviceAlias: queryObj.alias,
    })

    if (!serviceConfig) {
      if (queryObj.alias) {
        throw new Error(`Service with alias "${queryObj.alias}" was not found.`)
      }
      throw new Error(`Service "${queryObj.service}" was not found.`)
    }

    const initialData = options?.initialData
      ? Array.isArray(options.initialData)
        ? options.initialData
        : [options.initialData]
      : []

    const plan = compileQuery(
      {
        query: queryObj,
        serviceConfig,
        options,
        initialData,
      },
      this.catalog
    )

    if (options?.throwIfKeyNotFound) {
      if (plan.primaryKeyArg?.value == undefined) {
        if (!plan.primaryKeyArg) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `${
              serviceConfig.entity ?? serviceConfig.serviceName
            }: Primary key(s) [${serviceConfig.primaryKeys.join(
              ", "
            )}] not found in filters`
          )
        }

        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `${
            serviceConfig.entity ?? serviceConfig.serviceName
          }: Value for primary key ${plan.primaryKeyArg.name} not found in filters`
        )
      }
    }

    const { data, responsePath, rawResponse, wasArray } = await executePlan({
      plan,
      dataFetcher: this.dataFetcher,
      catalog: this.catalog,
    })

    const retData = wasArray ? data : data[0]
    if (responsePath) {
      rawResponse.data[responsePath] = retData
    } else {
      rawResponse.data = retData
    }

    return rawResponse.data
  }
}
