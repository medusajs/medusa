import { IndexOrderBy } from "../index-data/query-config/query-input-config-order-by"
import { ObjectToRemoteQueryFields } from "./object-to-remote-query-fields"
import { RemoteQueryEntryPoints } from "./remote-query-entry-points"
import { RemoteQueryFilters } from "./to-remote-query"

export type RemoteQueryObjectConfig<TEntry extends string> = {
  // service: string This property is still supported under the hood but part of the type due to types missmatch towards fields
  entryPoint: TEntry | keyof RemoteQueryEntryPoints
  variables?: any
  fields: ObjectToRemoteQueryFields<
    RemoteQueryEntryPoints[TEntry & keyof RemoteQueryEntryPoints]
  > extends never
    ? string[]
    : ObjectToRemoteQueryFields<
        RemoteQueryEntryPoints[TEntry & keyof RemoteQueryEntryPoints]
      >[]
}

export type RemoteQueryObjectFromStringResult<
  TConfig extends RemoteQueryObjectConfig<any>
> = {
  __TConfig: TConfig
  __value: object
}

export type RemoteQueryInput<TEntry extends string> = {
  // service: string This property is still supported under the hood but part of the type due to types missmatch towards fields
  entity: TEntry | keyof RemoteQueryEntryPoints
  fields: ObjectToRemoteQueryFields<
    RemoteQueryEntryPoints[TEntry & keyof RemoteQueryEntryPoints]
  > extends never
    ? string[]
    : ObjectToRemoteQueryFields<
        RemoteQueryEntryPoints[TEntry & keyof RemoteQueryEntryPoints]
      >[]
  pagination?: {
    skip: number
    take?: number
    order?: IndexOrderBy<TEntry>
  }
  filters?: RemoteQueryFilters<TEntry>
  context?: any
}

export type RemoteQueryGraph<TEntry extends string> = {
  __TConfig: RemoteQueryObjectConfig<TEntry>
}
