import { Prettify } from "../common"
import { OperatorMap } from "../dal"
import { RemoteQueryEntryPoints } from "./remote-query-entry-points"

type ExcludedProps = "__typename"
type Depth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
type CleanupObject<T> = Omit<Exclude<T, symbol>, ExcludedProps>
type OmitNever<T extends object> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
}

type ExtractFiltersOperators<T, Lim extends number = Depth[2]> = {
  [Key in keyof CleanupObject<T>]?: CleanupObject<T>[Key] extends
    | string
    | number
    | boolean
    | Date
    ?
        | CleanupObject<T>[Key]
        | OperatorMap<CleanupObject<T>[Key] | CleanupObject<T>[Key][]>
    : CleanupObject<T>[Key] extends Array<infer R>
    ? R extends object
      ? RemoteQueryFilters<Key & string, CleanupObject<T>, Depth[Lim]>
      : never
    : CleanupObject<T>[Key] extends object
    ? RemoteQueryFilters<Key & string, CleanupObject<T>, Depth[Lim]>
    : never
}

/**
 * Extract all available filters from a remote entry point deeply
 */
export type RemoteQueryFilters<
  TEntry extends string,
  RemoteQueryEntryPointsLevel = RemoteQueryEntryPoints,
  Lim extends number = Depth[3]
> = Lim extends number
  ? TEntry extends keyof RemoteQueryEntryPointsLevel
    ? RemoteQueryEntryPointsLevel[TEntry] extends Array<infer V>
      ? Prettify<OmitNever<ExtractFiltersOperators<V, Lim>>>
      : Prettify<
          OmitNever<
            ExtractFiltersOperators<RemoteQueryEntryPointsLevel[TEntry], Lim>
          >
        >
    : Record<string, any>
  : never
