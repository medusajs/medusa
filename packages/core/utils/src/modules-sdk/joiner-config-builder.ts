import {
  IDmlEntityConfig,
  InferDmlEntityNameFromConfig,
  JoinerServiceConfigAlias,
  ModuleJoinerConfig,
  PropertyType,
  SnakeCase,
} from "@medusajs/types"
import { join } from "path"
import {
  camelToSnakeCase,
  getCallerFilePath,
  MapToConfig,
  pluralize,
  upperCaseFirst,
} from "../common"
import { loadModels } from "./loaders/load-models"
import { DmlEntity } from "../dml"
import { BaseRelationship } from "../dml/relations/base"
import { PrimaryKeyModifier } from "../dml/properties/primary-key"
import { inferPrimaryKeyProperties } from "../dml/helpers/entity-builder/infer-primary-key-properties"
import { IdProperty } from "../dml/properties/id"

/**
 * Define joiner config for a module based on the models (object representation or entities) present in the models directory. This action will be sync until
 * we move to at least es2022 to have access to top-leve await.
 *
 * The aliases will be built from the entityQueryingConfig and custom aliases if provided, in case of aliases provided if the methodSuffix is not provided
 * then it will be inferred from the entity name of the alias args.
 *
 * @param moduleName
 * @param alias
 * @param schema
 * @param entityQueryingConfig
 * @param linkableKeys
 * @param primaryKeys
 */
export function defineJoinerConfig(
  moduleName: string,
  {
    alias,
    schema,
    dmlObjects,
    linkableKeys,
    primaryKeys,
  }: {
    alias?: JoinerServiceConfigAlias[]
    schema?: string
    dmlObjects?: { name: string }[]
    linkableKeys?: Record<string, string>
    primaryKeys?: string[]
  } = {}
): Omit<
  ModuleJoinerConfig,
  "serviceName" | "primaryKeys" | "linkableKeys" | "alias"
> &
  Required<
    Pick<
      ModuleJoinerConfig,
      "serviceName" | "primaryKeys" | "linkableKeys" | "alias"
    >
  > {
  let basePath = getCallerFilePath()
  basePath = basePath.includes("dist")
    ? basePath.split("dist")[0] + "dist"
    : basePath.split("src")[0] + "src"
  basePath = join(basePath, "models")

  let models = dmlObjects ?? loadModels(basePath)
  const dmlModels = models.map((model) => !!DmlEntity.isDmlEntity(model))
  const mikroOrmModels = models.map((model) => !DmlEntity.isDmlEntity(model))

  return {
    serviceName: moduleName,
    primaryKeys: primaryKeys ?? ["id"],
    schema,
    linkableKeys:
      linkableKeys ??
      models.reduce((acc, entity) => {
        acc[`${camelToSnakeCase(entity.name).toLowerCase()}_id`] = entity.name
        return acc
      }, {} as Record<string, string>),
    alias: [
      ...[...(alias ?? ([] as any))].map((alias) => ({
        name: alias.name,
        args: {
          entity: alias.args.entity,
          methodSuffix:
            alias.args.methodSuffix ??
            pluralize(upperCaseFirst(alias.args.entity)),
        },
      })),
      ...models
        .filter((model) => {
          return (
            !alias || !alias.some((alias) => alias.args?.entity === model.name)
          )
        })
        .map((entity, i) => ({
          name: [
            `${camelToSnakeCase(entity.name).toLowerCase()}`,
            `${pluralize(camelToSnakeCase(entity.name).toLowerCase())}`,
          ],
          args: {
            entity: entity.name,
            methodSuffix: pluralize(upperCaseFirst(entity.name)),
          },
        })),
    ],
  }
}

type InferLinkableKeyName<
  Key,
  Property,
  DmlConfig extends IDmlEntityConfig
> = Property extends PrimaryKeyModifier<any, any>
  ? `${Lowercase<SnakeCase<InferDmlEntityNameFromConfig<DmlConfig>>>}_${Key &
      string}`
  : never

export type InferDmlSchemaPrimaryKeys<
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
export type InferSchemaLinkableKeys<T> = T extends DmlEntity<any>
  ? keyof InferDmlSchemaPrimaryKeys<T, true> extends keyof {}
    ? InferDmlSchemaPrimaryKeys<T>
    : InferDmlSchemaPrimaryKeys<T, true>
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
 * const linkableKeys = buildLinkableKeysFromDmlObjects([user, car]) // { user_id: 'user', car_id: 'car', car_number_plate: 'car' }
 *
 */
type InferLinkableKeys<T extends DmlEntity<any>[]> = UnionToIntersection<
  FlattenUnion<AggregateSchemasLinkableKeys<T>>[0]
>

/**
 * From a set of DML objects, build the linkable keys
 * @param dmlObjects
 */
export function buildLinkableKeysFromDmlObjects<
  T extends DmlEntity<any>[],
  LinkableKeys = InferLinkableKeys<T>
>(dmlObjects: T): LinkableKeys {
  const linkableKeys = {} as LinkableKeys

  for (const dml of dmlObjects) {
    dml.schema = inferPrimaryKeyProperties(dml.schema)
    const schema = dml.schema
    const primaryKeys: string[] = []

    for (const [property, value] of Object.entries(schema)) {
      if (BaseRelationship.isRelationship(value)) {
        continue
      }

      const parsedProperty = (value as PropertyType<any>).parse(property)
      if (PrimaryKeyModifier.isPrimaryKeyModifier(value)) {
        const linkableKeyName =
          parsedProperty.dataType.options?.linkable ??
          `${camelToSnakeCase(dml.name).toLowerCase()}_${property}`
        primaryKeys.push(linkableKeyName)
      }
    }

    if (primaryKeys.length) {
      primaryKeys.forEach((primaryKey) => {
        linkableKeys[primaryKey] = dml.name
      })
    }
  }

  return linkableKeys
}

/**
 * Build linkable keys from MikroORM objects
 * @deprecated
 * @param models
 */
export function buildLinkableKeysFromMikroOrmObjects(
  models: Function[]
): Record<string, string> {
  return models.reduce((acc, entity) => {
    acc[`${camelToSnakeCase(entity.name).toLowerCase()}_id`] = entity.name
    return acc
  }, {}) as Record<string, string>
}

/**
 * Build entities name to linkable keys map
 * @param linkableKeys
 */
export function buildEntitiesNameToLinkableKeysMap(
  linkableKeys: Record<string, string>
): MapToConfig {
  const entityLinkableKeysMap: MapToConfig = {}
  Object.entries(linkableKeys).forEach(([key, value]) => {
    entityLinkableKeysMap[value] ??= []
    entityLinkableKeysMap[value].push({
      mapTo: key,
      valueFrom: key.split("_").pop()!,
    })
  })

  return entityLinkableKeysMap
}
