import { RemoteQueryEntryPoints } from "./remote-query-entry-points"
import { ObjectToStringPath } from "../common"

export type RemoteQueryObjectConfig<TEntry extends string> = {
  // service: string This property is still supported under the hood but part of the type due to types missmatch towards fields
  entryPoint: TEntry | keyof RemoteQueryEntryPoints
  variables?: any
  fields: ObjectToStringPath<
    RemoteQueryEntryPoints[TEntry & keyof RemoteQueryEntryPoints]
  > extends never
    ? string[]
    : ObjectToStringPath<
        RemoteQueryEntryPoints[TEntry & keyof RemoteQueryEntryPoints]
      >[]
}

export interface RemoteQueryObjectFromStringResult<TEntry extends string> {
  __TEntry: TEntry
  value: object
}
