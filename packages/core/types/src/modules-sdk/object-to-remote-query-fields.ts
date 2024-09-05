type Marker = [never, 0, 1, 2, 3, 4]

type ExcludedProps = ["__typename"]

type ExpandStarSelector<
  T extends object,
  Depth extends number,
  Exclusion extends string[]
> = ObjectToRemoteQueryFields<T & { "*": "*" }, Depth, Exclusion>

type TypeOnly<T> = Required<Exclude<T, null | undefined>>

/**
 * Output an array of strings representing the path to each leaf node in an object
 */
export type ObjectToRemoteQueryFields<
  MaybeT,
  Depth extends number = 2,
  Exclusion extends string[] = [],
  T = TypeOnly<MaybeT> & { "*": "*" }
> = Depth extends never
  ? never
  : T extends object
  ? {
      [K in keyof T]: K extends ExcludedProps[number]
        ? never
        : K extends Exclusion[number]
        ? never
        : TypeOnly<T[K]> extends Array<infer R>
        ? TypeOnly<R> extends object
          ? `${Exclude<K, symbol>}.${ExpandStarSelector<
              TypeOnly<R>,
              Marker[Depth],
              [K & string, ...Exclusion]
            >}`
          : never
        : TypeOnly<T[K]> extends object
        ? `${Exclude<K, symbol>}.${ExpandStarSelector<
            TypeOnly<T[K]>,
            Marker[Depth],
            [K & string, ...Exclusion]
          >}`
        : Exclude<K, symbol>
    }[keyof T]
  : never
