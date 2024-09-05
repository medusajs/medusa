import { RemoteQueryEntryPoints } from "./remote-query-entry-points"
import { ObjectToRemoteQueryFields } from "./object-to-remote-query-fields"

export type RemoteQueryObjectConfig<TEntry extends string> = {
  // service: string This property is still supported under the hood but part of the type due to types missmatch towards fields
  entryPoint: TEntry | keyof RemoteQueryEntryPoints
  variables?: any
  fields: TEntry extends keyof RemoteQueryEntryPoints
    ? ObjectToRemoteQueryFields<RemoteQueryEntryPoints[TEntry]>[]
    : string[]
}

export interface RemoteQueryObjectFromStringResult<
  TEntry extends string,
  TConfig extends RemoteQueryObjectConfig<TEntry>
> {
  __TConfig: TConfig
  __TEntry: TEntry
  __value: object
}
