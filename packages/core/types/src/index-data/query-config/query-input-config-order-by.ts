import { Prettify } from "../../common"
import { IndexServiceEntryPoints } from "../index-service-entry-points"
import {
  CleanupObject,
  Depth,
  ExcludedProps,
  OmitNever,
  TypeOnly,
} from "./common"

export type OrderBy = "ASC" | "DESC" | 1 | -1 | true | false

type ExtractOrderByOperators<
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
    ? OrderBy
    : TypeOnly<T[Key]> extends Array<infer R>
    ? TypeOnly<R> extends { __typename: any }
      ? IndexOrderBy<Key & string, T, [Key & string, ...Exclusion], Depth[Lim]>
      : TypeOnly<R> extends object
      ? CleanupObject<TypeOnly<R>>
      : never
    : TypeOnly<T[Key]> extends { __typename: any }
    ? IndexOrderBy<
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
 * Extract all available orderBy from a remote entry point deeply
 */
export type IndexOrderBy<
  TEntry extends string,
  IndexEntryPointsLevel = IndexServiceEntryPoints,
  Exclusion extends string[] = [],
  Lim extends number = Depth[3]
> = Lim extends number
  ? TEntry extends keyof IndexEntryPointsLevel
    ? TypeOnly<IndexEntryPointsLevel[TEntry]> extends Array<infer V>
      ? Prettify<
          OmitNever<ExtractOrderByOperators<V, Lim, [TEntry, ...Exclusion]>>
        >
      : Prettify<
          OmitNever<
            ExtractOrderByOperators<
              IndexEntryPointsLevel[TEntry],
              Lim,
              [TEntry, ...Exclusion]
            >
          >
        >
    : Record<string, any>
  : never
