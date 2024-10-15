import { Prettify } from "../../common"
import { IndexOperatorMap as OperatorMap } from "../index-operator-map"
import { IndexServiceEntryPoints } from "../index-service-entry-points"
import {
  CleanupObject,
  Depth,
  ExcludedProps,
  OmitNever,
  TypeOnly,
} from "./common"

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
    : TypeOnly<T[Key]> extends string | number | boolean | Date
    ? TypeOnly<T[Key]> | TypeOnly<T[Key]>[] | OperatorMap<TypeOnly<T[Key]>>
    : TypeOnly<T[Key]> extends Array<infer R>
    ? TypeOnly<R> extends { __typename: any }
      ? IndexFilters<Key & string, T, [Key & string, ...Exclusion], Depth[Lim]>
      : TypeOnly<R> extends object
      ? CleanupObject<TypeOnly<R>>
      : never
    : TypeOnly<T[Key]> extends { __typename: any }
    ? IndexFilters<
        Key & string,
        T[Key],
        [Key & string, ...Exclusion],
        Depth[Lim]
      >
    : TypeOnly<T[Key]> extends object
    ? CleanupObject<TypeOnly<T[Key]>>
    : never
}

/**
 * Extract all available filters from an index entry point deeply
 */
export type IndexFilters<
  TEntry extends string,
  IndexEntryPointsLevel = IndexServiceEntryPoints,
  Exclusion extends string[] = [],
  Lim extends number = Depth[3]
> = Lim extends number
  ? TEntry extends keyof IndexEntryPointsLevel
    ? TypeOnly<IndexEntryPointsLevel[TEntry]> extends Array<infer V>
      ? Prettify<
          OmitNever<ExtractFiltersOperators<V, Lim, [TEntry, ...Exclusion]>>
        >
      : Prettify<
          OmitNever<
            ExtractFiltersOperators<
              IndexEntryPointsLevel[TEntry],
              Lim,
              [TEntry, ...Exclusion]
            >
          >
        >
    : Record<string, any>
  : never
