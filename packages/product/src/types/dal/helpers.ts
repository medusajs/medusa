type ExpandProperty<T> = T extends (infer U)[] ? NonNullable<U> : NonNullable<T>

type Dictionary<T = any> = {
  [k: string]: T
}

type Query<T> = T extends object
  ? T extends Scalar
    ? never
    : FilterQuery<T>
  : FilterValue<T>
type EntityProps<T> = {
  -readonly [K in keyof T as ExcludeFunctions<T, K>]?: T[K]
}

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

type OperatorMap<T> = {
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

type ExpandObject<T> = T extends object
  ? T extends Scalar
    ? never
    : {
        -readonly [K in keyof T as ExcludeFunctions<T, K>]?:
          | Query<any>
          | FilterValue<any>
          | null
      }
  : never

type ObjectQuery<T> = ExpandObject<T> & OperatorMap<T>

export type FilterQuery<T> =
  | ObjectQuery<T>
  | NonNullable<ExpandScalar<Primary<T>>>
  | NonNullable<EntityProps<T> & OperatorMap<T>>
  | FilterQuery<T>[]

declare enum QueryOrder {
  ASC = "ASC",
  DESC = "DESC",
  asc = "asc",
  desc = "desc",
}

type QueryOrderKeysFlat = QueryOrder | 1 | -1 | keyof typeof QueryOrder
type QueryOrderKeys<T> = QueryOrderKeysFlat | QueryOrderMap<T>
type QueryOrderMap<T> = {
  [K in keyof T as ExcludeFunctions<T, K>]?: QueryOrderKeys<
    ExpandProperty<T[K]>
  >
}

type Order<T> = {
  [key in keyof T]?:
    | "ASC"
    | "DESC"
    | Order<T[key] extends Array<any> ? T[key][0] : T[key]>
}

export interface OptionsQuery<T, P extends string = never> {
  populate?: string[]
  orderBy?: Order<T> | Order<T>[]
  limit?: number
  offset?: number
  fields?: string[]
  groupBy?: string | string[]
  filters?: Dictionary<boolean | Dictionary> | string[] | boolean
}

export type FindOptions<T> = {
  where: FilterQuery<T>
  options?: OptionsQuery<T, any>
}
