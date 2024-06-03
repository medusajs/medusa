type ExpandProperty<T> = T extends (infer U)[] ? NonNullable<U> : NonNullable<T>

export type Dictionary<T = any> = {
  [k: string]: T
}

type Query<T> = T extends object
  ? T extends Scalar
    ? never
    : FilterQuery<T>
  : FilterValue<T>

type ExpandScalar<T> =
  | null
  | (T extends string ? string | RegExp : T extends Date ? Date | string : T)
type Scalar =
  | boolean
  | number
  | string
  | bigint
  | symbol
  | Date
  | RegExp
  | Buffer
  | {
      toHexString(): string
    }

type ExcludeFunctions<T, K extends keyof T> = T[K] extends Function
  ? never
  : K extends symbol
  ? never
  : K

type ReadonlyPrimary<T> = T extends any[] ? Readonly<T> : T

declare const PrimaryKeyType: unique symbol
type Primary<T> = T extends {
  [PrimaryKeyType]?: infer PK
}
  ? ReadonlyPrimary<PK>
  : T extends {
      _id?: infer PK
    }
  ? ReadonlyPrimary<PK> | string
  : T extends {
      uuid?: infer PK
    }
  ? ReadonlyPrimary<PK>
  : T extends {
      id?: infer PK
    }
  ? ReadonlyPrimary<PK>
  : never

export type OperatorMap<T> = {
  $and?: Query<T>[]
  $or?: Query<T>[]
  $eq?: ExpandScalar<T> | ExpandScalar<T>[]
  $ne?: ExpandScalar<T>
  $in?: ExpandScalar<T>[]
  $nin?: ExpandScalar<T>[]
  $not?: Query<T>
  $gt?: ExpandScalar<T>
  $gte?: ExpandScalar<T>
  $lt?: ExpandScalar<T>
  $lte?: ExpandScalar<T>
  $like?: string
  $re?: string
  $ilike?: string
  $fulltext?: string
  $overlap?: string[]
  $contains?: string[]
  $contained?: string[]
  $exists?: boolean
}

type FilterValue2<T> = T | ExpandScalar<T> | Primary<T>
type FilterValue<T> =
  | OperatorMap<FilterValue2<T>>
  | FilterValue2<T>
  | FilterValue2<T>[]
  | null

type PrevLimit = [never, 1, 2, 3]

export type FilterQuery<T = any, Prev extends number = 3> = Prev extends never
  ? never
  : {
      [Key in keyof T]?: T[Key] extends
        | boolean
        | number
        | string
        | bigint
        | symbol
        | Date
        ? T[Key] | OperatorMap<T[Key]>
        : T[Key] extends infer U
        ? U extends { [x: number]: infer V }
          ? V extends object
            ? FilterQuery<Partial<V>, PrevLimit[Prev]>
            : never
          : never
        : never
    }

declare type QueryOrder = "ASC" | "DESC" | "asc" | "desc"

type QueryOrderKeysFlat = QueryOrder | 1 | -1
type QueryOrderKeys<T> = QueryOrderKeysFlat | QueryOrderMap<T>
type QueryOrderMap<T> = {
  [K in keyof T as ExcludeFunctions<T, K>]?: QueryOrderKeys<
    ExpandProperty<T[K]>
  >
}

export type Order<T> = {
  [key in keyof T]?:
    | "ASC"
    | "DESC"
    | Order<T[key] extends Array<any> ? T[key][0] : T[key]>
}
