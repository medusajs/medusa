import {
  DMLSchema,
  IDmlEntityConfig,
  InferDmlEntityNameFromConfig,
  SnakeCase,
} from "@medusajs/types"
import { DmlEntity } from "../../dml"
import { PrimaryKeyModifier } from "../../dml/properties/primary-key"

type FlattenUnion<T> = T extends { [K in keyof T]: infer U }
  ? { [K in keyof T]: U }
  : never

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

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

type InferPrimaryKeyNameOrNever<
  Schema extends DMLSchema,
  Key extends keyof Schema
> = Schema[Key] extends PrimaryKeyModifier<any, any> ? Key : never

type InferSchemaLinksConfig<T> = T extends DmlEntity<infer Schema, infer Config>
  ? {
      [K in keyof Schema as Schema[K] extends PrimaryKeyModifier<any, any>
        ? InferPrimaryKeyNameOrNever<Schema, K>
        : never]: {
        linkable: InferLinkableKeyName<K, Schema[K], Config>
        primaryKey: K
      }
    }
  : {}

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
 * const linkConfig = buildLinkConfigFromDmlObjects([user, car])
 * // {
 * //   user: {
 * //     id: {
 * //       linkable: 'user_id',
 * //       primaryKey: 'id'
 * //     },
 * //     toJSON() { ... }
 * //   },
 * //   car: {
 * //     number_plate: {
 * //       linkable: 'car_number_plate',
 * //       primaryKey: 'number_plate'
 * //     },
 * //     toJSON() { ... }
 * //   }
 * // }
 *
 */
export type InfersLinksConfig<T extends DmlEntity<any, any>[]> =
  UnionToIntersection<{
    [K in keyof T as T[K] extends DmlEntity<any, infer Config>
      ? Uncapitalize<InferDmlEntityNameFromConfig<Config>>
      : never]: InferSchemaLinksConfig<T[K]> & {
      toJSON: () => {
        linkable: string
        primaryKey: string
      }
    }
  }>
