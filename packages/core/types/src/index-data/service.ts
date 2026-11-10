import { IModuleService, ModuleServiceInitializeOptions } from "../modules-sdk"
import { IndexQueryConfig, QueryResultSet } from "./query-config"

/**
 * Represents the module options that can be provided
 *
 * @deprecated The Index Module is deprecated and will be removed in a future release. Use `query.graph()` instead, which filters across linked modules: https://docs.medusajs.com/learn/fundamentals/query#filter-by-linked-data-models-property
 */
export interface IndexModuleOptions {
  customAdapter?: {
    constructor: new (...args: any[]) => any
    options: any
  }
  defaultAdapterOptions?: ModuleServiceInitializeOptions
  schema: string
}

export interface IndexInfo {
  id: string
  entity: string
  status: "pending" | "processing" | "done" | "error"
  fields: string[]
  updated_at: Date
  last_synced_key: string | null
}

/**
 * @deprecated The Index Module is deprecated and will be removed in a future release. Use `query.graph()` instead, which filters across linked modules: https://docs.medusajs.com/learn/fundamentals/query#filter-by-linked-data-models-property
 */
export interface IIndexService extends IModuleService {
  query<const TEntry extends string>(
    config: IndexQueryConfig<TEntry>
  ): Promise<QueryResultSet<TEntry>>

  /**
   * Sync the index
   * The sync strategy can be "full" meaning it will re sync the entire index, "reset" meaning it
   * will reset the index data and start from scratch, or if not specified, it will continue the
   * sync from the last sync point.
   *
   * @param strategy The sync strategy
   */
  sync({ strategy }?: { strategy?: "full" | "reset" }): Promise<void>

  /**
   * Get the index information
   * @returns The index information
   */
  getInfo(): Promise<IndexInfo[]>
}
