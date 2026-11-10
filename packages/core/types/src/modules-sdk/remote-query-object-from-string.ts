import { QueryContextType } from "../common"
import { IndexOrderBy } from "../index-data/query-config/query-input-config-order-by"
import { ObjectToRemoteQueryFields } from "./object-to-remote-query-fields"
import { RemoteQueryEntryPoints } from "./remote-query-entry-points"
import { RemoteQueryFilters } from "./to-remote-query"

export type RemoteQueryObjectConfig<TEntry extends string> = {
  entryPoint: TEntry | keyof RemoteQueryEntryPoints
  variables?: any
  fields: ObjectToRemoteQueryFields<
    RemoteQueryEntryPoints[TEntry & keyof RemoteQueryEntryPoints]
  > extends never
    ? string[]
    : | ObjectToRemoteQueryFields<
          RemoteQueryEntryPoints[TEntry & keyof RemoteQueryEntryPoints]
        >[]
      | string[]
}

export type RemoteQueryObjectFromStringResult<
  TConfig extends RemoteQueryObjectConfig<any>,
> = {
  __TConfig: TConfig
  __value: object
}

export type RemoteQueryInput<TEntry extends string> =
  TEntry extends keyof RemoteQueryEntryPoints
    ? {
        /**
         * The name of the entity to retrieve. For example, `product`.
         */
        entity: TEntry
        /**
         * The fields and relations to retrieve in the entity.
         */
        fields: ObjectToRemoteQueryFields<
          RemoteQueryEntryPoints[TEntry]
        > extends never
          ? string[]
          : | ObjectToRemoteQueryFields<RemoteQueryEntryPoints[TEntry]>[]
            | string[]
        /**
         * Pagination configurations for the returned list of items.
         */
        pagination?: {
          /**
           * The number of items to skip before retrieving the returned items.
           */
          skip?: number
          /**
           * The maximum number of items to return.
           */
          take?: number
          /**
           * Sort by field names in ascending or descending order.
           */
          order?: IndexOrderBy<TEntry>
        }
        /**
         * Filters to apply on the retrieved items.
         */
        filters?: RemoteQueryFilters<TEntry>
        /**
         * Apply a query context on the retrieved data. For example, to retrieve product prices for a certain context.
         */
        context?: QueryContextType
        /**
         * Apply a `withDeleted` flag on the retrieved data to retrieve soft deleted items.
         */
        withDeleted?: boolean
        /**
         * Strategy will be send to the entry module called method
         */
        strategy?: "joined" | "select-in" | "balanced"
      }
    : {
        /**
         * The name of the entity to retrieve. For example, `product`.
         */
        entity: TEntry | keyof RemoteQueryEntryPoints
        /**
         * The fields and relations to retrieve in the entity.
         */
        fields: ObjectToRemoteQueryFields<any> extends never
          ? string[]
          : ObjectToRemoteQueryFields<any>[] | string[]
        /**
         * Pagination configurations for the returned list of items.
         */
        pagination?: {
          /**
           * The number of items to skip before retrieving the returned items.
           */
          skip?: number
          /**
           * The maximum number of items to return.
           */
          take?: number
          /**
           * Sort by field names in ascending or descending order.
           */
          order?: IndexOrderBy<TEntry>
        }
        /**
         * Filters to apply on the retrieved items.
         */
        filters?: RemoteQueryFilters<TEntry>
        /**
         * Apply a query context on the retrieved data. For example, to retrieve product prices for a certain context.
         */
        context?: QueryContextType
        /**
         * Apply a `withDeleted` flag on the retrieved data to retrieve soft deleted items.
         */
        withDeleted?: boolean
        /**
         * Strategy will be send to the entry module called method
         */
        strategy?: "joined" | "select-in" | "balanced"
      }

export type RemoteQueryGraph<TEntry extends string> = {
  __TConfig: RemoteQueryObjectConfig<TEntry>
}
