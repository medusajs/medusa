type Marker = [never, 0, 1, 2, 3, 4]

type ExcludedProps = ["__typename"]

type ExpandStarSelector<
  T extends object,
  Depth extends number,
  Exclusion extends string[]
> = ObjectToStringPath<T & { "*": "*" }, Depth, Exclusion>

/**
 * Output an array of strings representing the path to each leaf node in an object
 */
export type ObjectToStringPath<
  T,
  Depth extends number = 2,
  Exclusion extends string[] = []
> = Depth extends never
  ? never
  : T extends object
  ? {
      [K in keyof T]: K extends ExcludedProps[number]
        ? never
        : K extends Exclusion[number]
        ? never
        : T[K] extends Array<infer R>
        ? R extends object
          ? `${Exclude<K, symbol>}.${ExpandStarSelector<
              R,
              Marker[Depth],
              [K & string, ...Exclusion]
            >}`
          : never
        : T[K] extends object
        ? `${Exclude<K, symbol>}.${ExpandStarSelector<
            T[K],
            Marker[Depth],
            [K & string, ...Exclusion]
          >}`
        : Exclude<K, symbol>
    }[keyof T]
  : never
