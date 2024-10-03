import { IModuleService, ModuleServiceInitializeOptions } from "../modules-sdk"
import { IndexQueryConfig, QueryResultSet } from "./query-config"

/**
 * Represents the module options that can be provided
 */
export interface IndexModuleOptions {
  customAdapter?: {
    constructor: new (...args: any[]) => any
    options: any
  }
  defaultAdapterOptions?: ModuleServiceInitializeOptions
  schema: string
}

export interface IIndexService extends IModuleService {
  query<const TEntry extends string>(
    config: IndexQueryConfig<TEntry>
  ): Promise<QueryResultSet<TEntry>>
}
