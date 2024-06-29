import {
  IDmlEntityConfig,
  InferDmlEntityNameFromConfig,
  SnakeCase,
} from "@medusajs/types"
import { DmlEntity } from "../../dml"
import { PrimaryKeyModifier } from "../../dml/properties/primary-key"
import { IdProperty } from "../../dml/properties/id"

type InferLinkableKeyName<
  Key,
  Property,
  DmlConfig extends IDmlEntityConfig
> = Property extends PrimaryKeyModifier<any, any>
  ? `${Lowercase<SnakeCase<InferDmlEntityNameFromConfig<DmlConfig>>>}_${Key &
      string}`
  : never

type InferSchemaPotentialLinkableKeys<
  T,
  OmitIdProperty = false
> = T extends DmlEntity<infer Schema, infer Config>
  ? {
      [K in keyof Schema as OmitIdProperty extends true
        ? Schema[K] extends PrimaryKeyModifier<any, infer PropertyType>
          ? PropertyType extends IdProperty
            ? never
            : InferLinkableKeyName<K, Schema[K], Config>
          : InferLinkableKeyName<K, Schema[K], Config>
        : InferLinkableKeyName<
            K,
            Schema[K],
            Config
          >]: InferDmlEntityNameFromConfig<Config>
    }
  : {}

/**
 * If not counting the ID property as a primary key return any results it implicitly means
 * that other properties has been marked as primary keys and the ID property is then removed as automatic primary key.
 * Therefor it returns all primary keys excluding the automatic ID property as primary keys if any explicit primary keys are defined.
 */
type InferSchemaLinkableKeys<T> = T extends DmlEntity<any>
  ? keyof InferSchemaPotentialLinkableKeys<T, true> extends keyof {}
    ? InferSchemaPotentialLinkableKeys<T>
    : InferSchemaPotentialLinkableKeys<T, true>
  : never

type InferSchemasLinkableKeys<T extends DmlEntity<any>[]> = {
  [K in keyof T]: InferSchemaLinkableKeys<T[K]>
}

type AggregateSchemasLinkableKeys<T extends DmlEntity<any>[]> = {
  [K in keyof InferSchemasLinkableKeys<T>]: InferSchemasLinkableKeys<T>[K]
}

type FlattenUnion<T> = T extends { [K in keyof T]: infer U }
  ? { [K in keyof T]: U }
  : never

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

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
export type InferLinkableKeys<T extends DmlEntity<any>[]> = UnionToIntersection<
  FlattenUnion<AggregateSchemasLinkableKeys<T>>[0]
>

type InferSchemaPotentialLinksConfig<
  T,
  OmitIdProperty = false
> = T extends DmlEntity<infer Schema, infer Config>
? {
    [K in keyof Schema as OmitIdProperty extends true
      ? Schema[K] extends PrimaryKeyModifier<any, infer PropertyType>
        ? PropertyType extends IdProperty
          ? Schema[K] extends PrimaryKeyModifier<any, any> ? K : never
          : Schema[K] extends PrimaryKeyModifier<any, any> ? K : never
        : Schema[K] extends PrimaryKeyModifier<any, any> ? K : never
      : Schema[K] extends PrimaryKeyModifier<any, any> ? K : never]: InferLinkableKeyName<K, Schema[K], Config>
  }
: {}

type InferSchemaLinksConfig<T> = T extends DmlEntity<any>
  ? keyof InferSchemaPotentialLinksConfig<T, true> extends keyof {}
    ? InferSchemaPotentialLinksConfig<T>
    : InferSchemaPotentialLinksConfig<T, true>
  : never
 
export type InfersLinksConfig<T extends DmlEntity<any>[]> = {
  [K in keyof T as T[K] extends DmlEntity<any, infer Config> ? Uncapitalize<InferDmlEntityNameFromConfig<Config>> : never]: T[K] extends DmlEntity<any> ? InferSchemaLinksConfig<T[K]> : never
}