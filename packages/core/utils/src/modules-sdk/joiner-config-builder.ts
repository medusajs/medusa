import {
  JoinerServiceConfigAlias,
  ModuleJoinerConfig,
  PropertyType,
} from "@medusajs/types"
import { dirname, join } from "path"
import {
  MapToConfig,
  camelToSnakeCase,
  deduplicate,
  getCallerFilePath,
  lowerCaseFirst,
  pluralize,
  upperCaseFirst,
} from "../common"
import { loadModels } from "./loaders/load-models"
import { DmlEntity } from "../dml"
import { BaseRelationship } from "../dml/relations/base"
import { PrimaryKeyModifier } from "../dml/properties/primary-key"
import { inferPrimaryKeyProperties } from "../dml/helpers/entity-builder/infer-primary-key-properties"
import { InferLinkableKeys, InfersLinksConfig } from "./types/links-config"

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
    dmlObjects?: DmlEntity<any>[] | { name: string }[]
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
  const fullPath = getCallerFilePath()
  const srcDir = fullPath.includes("dist") ? "dist" : "src"
  const splitPath = fullPath.split(srcDir)

  let basePath = splitPath[0] + srcDir

  const isMedusaProject = fullPath.includes(`${srcDir}/modules/`)
  if (isMedusaProject) {
    basePath = dirname(fullPath)
  }

  basePath = join(basePath, "models")

  let models = dmlObjects ?? loadModels(basePath)
  const dmlDefinitions = new Map(
    models
      .filter((model) => !!DmlEntity.isDmlEntity(model))
      .map((model) => [model.name, model])
  )
  const mikroOrmObjects = new Map(
    models
      .filter((model) => !DmlEntity.isDmlEntity(model))
      .map((model) => [model.name, model])
  )

  // We prioritize DML if there is any equivalent Mikro orm entities found
  models = [...dmlDefinitions.values()]
  mikroOrmObjects.forEach((model) => {
    if (dmlDefinitions.has(model.name)) {
      return
    }

    models.push(model)
  })

  if (!linkableKeys) {
    const linkableKeysFromDml = buildLinkableKeysFromDmlObjects([
      ...dmlDefinitions.values(),
    ])
    const linkableKeysFromMikroOrm = buildLinkableKeysFromMikroOrmObjects([
      ...mikroOrmObjects.values(),
    ])
    linkableKeys = {
      ...linkableKeysFromDml,
      ...linkableKeysFromMikroOrm,
    }
  }

  if (!primaryKeys && dmlDefinitions.size) {
    const linkConfig = buildLinkConfigFromDmlObjects([
      ...dmlDefinitions.values(),
    ])

    primaryKeys = deduplicate(
      Object.values(linkConfig).flatMap((entityLinkConfig) => {
        return Object.values(entityLinkConfig).map((linkableConfig) => {
          return (linkableConfig as { primaryKey: string }).primaryKey
        })
      })
    )
  }

  // TODO: In the context of DML add a validation on primary keys and linkable keys if the consumer provide them manually. follow up pr

  return {
    serviceName: moduleName,
    primaryKeys: primaryKeys ?? ["id"],
    schema,
    linkableKeys: linkableKeys,
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

/**
 * From a set of DML objects, build the linkable keys
 *
 * @example
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
 * // output:
 * // {
 * //   user_id: 'User',
 * //   car_number_plate: 'Car',
 * // }
 *
 * @param dmlObjects
 */
export function buildLinkableKeysFromDmlObjects<
  const T extends DmlEntity<any>[],
  LinkableKeys = InferLinkableKeys<T>
>(dmlObjects: T): LinkableKeys {
  const linkableKeys = {} as LinkableKeys

  for (const dml of dmlObjects) {
    if (!DmlEntity.isDmlEntity(dml)) {
      continue
    }

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
 *
 * @example
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
 * // output:
 * // {
 * //   user: {
 * //     id: "user_id",
 * //   },
 * //   car: {
 * //     number_plate: "car_number_plate",
 * //   },
 * // }
 *
 * @param dmlObjects
 */
export function buildLinkConfigFromDmlObjects<const T extends DmlEntity<any>[]>(
  dmlObjects: T = [] as unknown as T
): InfersLinksConfig<T> {
  const linkConfig = {} as InfersLinksConfig<T>

  for (const dml of dmlObjects) {
    if (!DmlEntity.isDmlEntity(dml)) {
      continue
    }

    dml.schema = inferPrimaryKeyProperties(dml.schema)
    const schema = dml.schema
    const dmlLinkConfig = (linkConfig[lowerCaseFirst(dml.name)] ??= {})

    for (const [property, value] of Object.entries(schema)) {
      if (BaseRelationship.isRelationship(value)) {
        continue
      }

      const parsedProperty = (value as PropertyType<any>).parse(property)
      if (PrimaryKeyModifier.isPrimaryKeyModifier(value)) {
        const linkableKeyName =
          parsedProperty.dataType.options?.linkable ??
          `${camelToSnakeCase(dml.name).toLowerCase()}_${property}`
        dmlLinkConfig[property] = {
          linkable: linkableKeyName,
          primaryKey: property,
        }
      }
    }
  }

  return linkConfig as InfersLinksConfig<T> & Record<any, any>
}

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
