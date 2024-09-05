import { RemoteQueryEntryPoints } from "./remote-query-entry-points"
import { ObjectToRemoteQueryFields } from "./object-to-remote-query-fields"

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
