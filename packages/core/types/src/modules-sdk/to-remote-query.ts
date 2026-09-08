import { Prettify as CorePrettify } from "../common"
import { OperatorMap } from "../dal"
import { RemoteQueryEntryPoints } from "./remote-query-entry-points"

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type Prettify<T> = DeepPartial<CorePrettify<T>>
type ExcludedProps = "__typename"
type Depth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
type CleanupObject<T> = Prettify<Omit<Exclude<T, symbol>, ExcludedProps>>
type OmitNever<T extends object> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
}
type TypeOnly<T> = Required<Exclude<T, null | undefined>>

type ExtractFiltersOperators<
  MaybeT,
  Lim extends number = Depth[2],
  Exclusion extends string[] = [],
  T = TypeOnly<MaybeT>
> = {
  [Key in keyof T]?: Key extends Exclusion[number]
    ? never
    : Key extends ExcludedProps
    ? never
    : NonNullable<T[Key]> extends string | number | boolean | Date
    ? T[Key] | T[Key][] | OperatorMap<T[Key] | T[Key][]>
    : T[Key] extends Array<infer R>
    ? TypeOnly<R> extends { __typename: string }
      ? RemoteQueryFilters<
          Key & string,
          T,
          [Key & string, ...Exclusion],
          Depth[Lim]
        >
      : R extends object
      ? CleanupObject<R>
      : never
    : // TypeOnly strips the Maybe<> wrapper and makes the generator's
    // optional __typename required so entity relations are detected;
    // `__typename: string` avoids matching JSON scalars via index signature.
    TypeOnly<T[Key]> extends { __typename: string }
    ? RemoteQueryFilters<
        Key & string,
        T,
        [Key & string, ...Exclusion],
        Depth[Lim]
      >
    : T[Key] extends object
    ? CleanupObject<T[Key]>
    : never
}

type RemoteQueryFilterOperators<T> = {
  $or?: (T & RemoteQueryFilterOperators<T>)[]
  $and?: (T & RemoteQueryFilterOperators<T>)[]
  $not?: T & RemoteQueryFilterOperators<T>
}

/**
 * Extract all available filters from a remote entry point deeply
 */
export type InternalRemoteQueryFilters<
  TEntry extends string,
  RemoteQueryEntryPointsLevel = RemoteQueryEntryPoints,
  Exclusion extends string[] = [],
  Lim extends number = Depth[3]
> = Lim extends number
  ? TEntry extends keyof RemoteQueryEntryPointsLevel
    ? TypeOnly<RemoteQueryEntryPointsLevel[TEntry]> extends Array<infer V>
      ? Prettify<
          OmitNever<ExtractFiltersOperators<V, Lim, [TEntry, ...Exclusion]>>
        >
      : Prettify<
          OmitNever<
            ExtractFiltersOperators<
              RemoteQueryEntryPointsLevel[TEntry],
              Lim,
              [TEntry, ...Exclusion]
            >
          >
        >
    : Record<string, any>
  : never

export type RemoteQueryFilters<
  TEntry extends string,
  RemoteQueryEntryPointsLevel = RemoteQueryEntryPoints,
  Exclusion extends string[] = [],
  Lim extends number = Depth[3]
> = RemoteQueryFilterOperators<
  DeepPartial<
    InternalRemoteQueryFilters<
      TEntry,
      RemoteQueryEntryPointsLevel,
      Exclusion,
      Lim
    >
  >
> &
  DeepPartial<
    InternalRemoteQueryFilters<
      TEntry,
      RemoteQueryEntryPointsLevel,
      Exclusion,
      Lim
    >
  >
