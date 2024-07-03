import {
  DMLSchema,
  IDmlEntityConfig,
  InferDmlEntityNameFromConfig,
  SnakeCase,
} from "@medusajs/types"
import { DmlEntity } from "../../dml"
import { PrimaryKeyModifier } from "../../dml/properties/primary-key"

/**
 * Utils
 */

type FlattenUnion<T> = T extends { [K in keyof T]: infer U }
  ? { [K in keyof T]: U }
  : never

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

type UnionToOvlds<U> = UnionToIntersection<
  U extends any ? (f: U) => void : never
>

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true

type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A]

type Reverse<T extends unknown[], R extends unknown[] = []> = ReturnType<
  T extends [infer F, ...infer L] ? () => Reverse<L, [F, ...R]> : () => R
>

/**
 * End of utils
 */

/**
 * Linkable keys
 */

type InferLinkableKeyName<
  Key,
  Property,
  DmlConfig extends IDmlEntityConfig
> = Property extends PrimaryKeyModifier<any, any>
  ? `${Lowercase<SnakeCase<InferDmlEntityNameFromConfig<DmlConfig>>>}_${Key &
      string}`
  : never

type InferSchemaLinkableKeys<T> = T extends DmlEntity<
  infer Schema,
  infer Config
>
  ? {
      [K in keyof Schema as Schema[K] extends PrimaryKeyModifier<any, any>
        ? InferLinkableKeyName<K, Schema[K], Config>
        : never]: InferDmlEntityNameFromConfig<Config>
    }
  : {}

type InferSchemasLinkableKeys<T extends DmlEntity<any, any>[]> = {
  [K in keyof T]: InferSchemaLinkableKeys<T[K]>
}

type AggregateSchemasLinkableKeys<T extends DmlEntity<any, any>[]> = {
  [K in keyof InferSchemasLinkableKeys<T>]: InferSchemasLinkableKeys<T>[K]
}

/**
 * From an array of DmlEntity, returns a formatted object with the linkable keys
 *
 * @example:
 *
 * const user = model.define("user", {
 *   id: model.id(),
 *   name: model.text(),
 * })
 *
 * const car = model.define("car", {
 *   id: model.id(),
 *   number_plate: model.text().primaryKey(),
 *   test: model.text(),
 * })
 *
 * const linkableKeys = buildLinkableKeysFromDmlObjects([user, car]) // { user_id: 'user', car_number_plate: 'car' }
 *
 */
export type InferLinkableKeys<T extends DmlEntity<any, any>[]> =
  UnionToIntersection<FlattenUnion<AggregateSchemasLinkableKeys<T>>[0]>

/**
 * End Linkable keys
 */

/**
 * Links config
 */

/**
 * From a union infer an Array and return the last element
 */
type InferLastLink<ServiceName extends string, DmlEntity> = UnionToArray<
  | InferSchemaLinksConfig<ServiceName, DmlEntity>[keyof InferSchemaLinksConfig<
      ServiceName,
      DmlEntity
    >]
> extends [...any, infer V]
  ? V
  : never

type InferLastPrimaryKey<ServiceName extends string, DmlEntity> = InferLastLink<
  ServiceName,
  DmlEntity
> extends {
  primaryKey: infer PrimaryKey
}
  ? PrimaryKey
  : string

type InferLastLinkable<ServiceName extends string, DmlEntity> = InferLastLink<
  ServiceName,
  DmlEntity
> extends {
  linkable: infer Linkable
}
  ? Linkable
  : string

type InferPrimaryKeyNameOrNever<
  Schema extends DMLSchema,
  Key extends keyof Schema
> = Schema[Key] extends PrimaryKeyModifier<any, any> ? Key : never

type InferSchemaLinksConfig<
  ServiceName extends string,
  T
> = T extends DmlEntity<infer Schema, infer Config>
  ? {
      [K in keyof Schema as Schema[K] extends PrimaryKeyModifier<any, any>
        ? InferPrimaryKeyNameOrNever<Schema, K>
        : never]: {
        serviceName: ServiceName
        field: T extends DmlEntity<any, infer Config>
          ? Uncapitalize<InferDmlEntityNameFromConfig<Config>>
          : string
        linkable: InferLinkableKeyName<K, Schema[K], Config>
        primaryKey: K
      }
    }
  : {}

/**
 * From an array of DmlEntity, returns a formatted links object.
 * the toJSON of each object representation will return the last linkable definition
 * as the default. To specify a specific linkable, you can chain until the desired linkable property.
 *
 *
 * @example:
 *
 * const user = model.define("user", {
 *   id: model.id(),
 *   name: model.text(),
 * })
 *
 * const car = model.define("car", {
 *   id: model.id(),
 *   number_plate: model.text().primaryKey(),
 *   test: model.text(),
 * })
 *
 * const linkConfig = buildLinkConfigFromDmlObjects([user, car])
 * // {
 * //   user: {
 * //     id: {
 * //       serviceName: 'userService',
 * //       field: 'user',
 * //       linkable: 'user_id',
 * //       primaryKey: 'id'
 * //     },
 * //     toJSON() { ... }
 * //   },
 * //   car: {
 * //     number_plate: {
 * //       serviceName: 'userService',
 * //       field: 'car',
 * //       linkable: 'car_number_plate',
 * //       primaryKey: 'number_plate'
 * //     },
 * //     toJSON() { ... }
 * //   }
 * // }
 *
 */
export type InfersLinksConfig<
  ServiceName extends string,
  T extends DmlEntity<any, any>[]
> = UnionToIntersection<{
  [K in keyof T as T[K] extends DmlEntity<any, infer Config>
    ? Uncapitalize<InferDmlEntityNameFromConfig<Config>>
    : never]: InferSchemaLinksConfig<ServiceName, T[K]> & {
    toJSON: () => {
      serviceName: ServiceName
      field: T[K] extends DmlEntity<any, infer Config>
        ? Uncapitalize<InferDmlEntityNameFromConfig<Config>>
        : string
      linkable: InferLastLinkable<ServiceName, T[K]>
      primaryKey: InferLastPrimaryKey<ServiceName, T[K]>
    }
  }
}>

/**
 * End Links config
 */
