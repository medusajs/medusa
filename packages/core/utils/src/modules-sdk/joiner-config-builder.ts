import {
  IDmlEntity,
  JoinerServiceConfigAlias,
  ModuleJoinerConfig,
  PropertyType,
} from "@medusajs/types"
import * as path from "path"
import { dirname, join } from "path"
import {
  camelToSnakeCase,
  deduplicate,
  getCallerFilePath,
  isObject,
  lowerCaseFirst,
  MapToConfig,
  pluralize,
  toCamelCase,
  upperCaseFirst,
} from "../common"
import { loadModels } from "./loaders/load-models"
import { DmlEntity } from "../dml"
import { BaseRelationship } from "../dml/relations/base"
import { PrimaryKeyModifier } from "../dml/properties/primary-key"
import { InferLinkableKeys, InfersLinksConfig } from "./types/links-config"
import { accessSync } from "fs"

/**
 * Define joiner config for a module based on the models (object representation or entities) present in the models directory. This action will be sync until
 * we move to at least es2022 to have access to top-leve await.
 *
 * The aliases will be built from the entityQueryingConfig and custom aliases if provided, in case of aliases provided if the methodSuffix is not provided
 * then it will be inferred from the entity name of the alias args.
 *
 * @param serviceName
 * @param alias custom aliases will be merged with the computed aliases from the provided models. Though, if a custom alias correspond to a computed alias for the same model then the custom alias will take place. Also, note that the methodSuffix will be inferred from the entity name if not provided as part of the args.
 * @param schema
 * @param models
 * @param linkableKeys
 * @param primaryKeys
 */
export function defineJoinerConfig(
  serviceName: string,
  {
    alias,
    schema,
    models,
    linkableKeys,
    primaryKeys,
  }: {
    alias?: JoinerServiceConfigAlias[]
    schema?: string
    models?: DmlEntity<any, any>[] | { name: string }[]
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
  let loadedModels = models

  if (!loadedModels) {
    loadedModels = []

    let index = 1

    while (true) {
      ++index
      let fullPath = getCallerFilePath(index)
      if (!fullPath) {
        break
      }

      /**
       * Handle integration-tests/__tests__ path based on conventional naming
       */
      if (fullPath.includes("integration-tests/__tests__")) {
        const sourcePath = fullPath.split("integration-tests/__tests__")[0]
        fullPath = path.join(sourcePath, "src")
      }

      const srcDir = fullPath.includes("dist") ? "dist" : "src"
      const splitPath = fullPath.split(srcDir)

      let basePath = splitPath[0] + srcDir

      const isMedusaProject = fullPath.includes(`${srcDir}/modules/`)
      if (isMedusaProject) {
        basePath = dirname(fullPath)
      }

      basePath = join(basePath, "models")
      let doesModelsDirExist = false
      try {
        accessSync(path.resolve(basePath))
        doesModelsDirExist = true
      } catch (e) {}

      if (!doesModelsDirExist) {
        continue
      }

      loadedModels = loadModels(basePath)

      if (loadedModels.length) {
        break
      }
    }
  }

  const modelDefinitions = new Map<string, DmlEntity<any, any>>(
    loadedModels!
      .filter(
        (model): model is DmlEntity<any, any> => !!DmlEntity.isDmlEntity(model)
      )
      .map((model) => [model.name, model])
  )
  const mikroOrmObjects = new Map<string, Function>(
    loadedModels!
      .filter((model): model is Function => !DmlEntity.isDmlEntity(model))
      .map((model) => [model.name, model])
  )

  // We prioritize DML if there is any equivalent Mikro orm entities found
  const deduplicatedLoadedModels = [...modelDefinitions.values()] as (
    | DmlEntity<any, any>
    | { name: string }
  )[]
  mikroOrmObjects.forEach((model) => {
    if (modelDefinitions.has(model.name)) {
      return
    }

    deduplicatedLoadedModels.push(model)
  })

  if (!linkableKeys) {
    const linkableKeysFromDml = buildLinkableKeysFromDmlObjects([
      ...modelDefinitions.values(),
    ])
    const linkableKeysFromMikroOrm = buildLinkableKeysFromMikroOrmObjects([
      ...mikroOrmObjects.values(),
    ])
    linkableKeys = {
      ...linkableKeysFromDml,
      ...linkableKeysFromMikroOrm,
    }
  }

  if (!primaryKeys && modelDefinitions.size) {
    const linkConfig = buildLinkConfigFromModelObjects(
      serviceName,
      Object.fromEntries(modelDefinitions)
    )

    primaryKeys = deduplicate(
      Object.values(linkConfig).flatMap((entityLinkConfig) => {
        return (Object.values(entityLinkConfig as any) as any[])
          .filter((linkableConfig) => isObject(linkableConfig))
          .map((linkableConfig) => {
            return linkableConfig.primaryKey
          })
      })
    )
  }

  // TODO: In the context of DML add a validation on primary keys and linkable keys if the consumer provide them manually. follow up pr

  return {
    serviceName,
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
      ...deduplicatedLoadedModels
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
            entity: upperCaseFirst(entity.name),
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
 * const linkableKeys = buildLinkableKeysFromDmlObjects([user, car])
 *
 * // output:
 * // {
 * //   user_id: 'User',
 * //   car_number_plate: 'Car',
 * // }
 *
 * @param models
 */
export function buildLinkableKeysFromDmlObjects<
  const T extends DmlEntity<any, any>[],
  LinkableKeys = InferLinkableKeys<T>
>(models: T): LinkableKeys {
  const linkableKeys = {} as LinkableKeys

  for (const model of models) {
    if (!DmlEntity.isDmlEntity(model)) {
      continue
    }

    const schema = model.schema
    const primaryKeys: string[] = []

    for (const [property, value] of Object.entries(schema)) {
      if (BaseRelationship.isRelationship(value)) {
        continue
      }

      const parsedProperty = (value as PropertyType<any>).parse(property)
      if (PrimaryKeyModifier.isPrimaryKeyModifier(value)) {
        const linkableKeyName =
          parsedProperty.dataType.options?.linkable ??
          `${camelToSnakeCase(model.name).toLowerCase()}_${property}`
        primaryKeys.push(linkableKeyName)
      }
    }

    if (primaryKeys.length) {
      primaryKeys.forEach((primaryKey) => {
        linkableKeys[primaryKey] = upperCaseFirst(model.name)
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
 * const links = buildLinkConfigFromModelObjects('userService', { user, car })
 *
 * // output:
 * // {
 * //   user: {
 * //     id: {
 * //       serviceName: 'userService', // The name of the module service it originate from
 * //       field: 'user',              // The field name of the entity, the query field is inferred from it as kebab cased singular/plural
 * //       linkable: 'user_id',        // The linkable key
 * //       primaryKey: 'id'            // The primary key if refers to in the original object representation, it will be used to be passed to the filters of the corresponding public service method
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
 * @param serviceName
 * @param models
 */
export function buildLinkConfigFromModelObjects<
  const ServiceName extends string,
  const T extends Record<string, IDmlEntity<any, any>>
>(serviceName: ServiceName, models: T): InfersLinksConfig<ServiceName, T> {
  const linkConfig = {} as InfersLinksConfig<ServiceName, T>

  for (const model of Object.values(models) ?? []) {
    if (!DmlEntity.isDmlEntity(model)) {
      continue
    }

    const schema = model.schema
    // @ts-ignore
    const modelLinkConfig = (linkConfig[lowerCaseFirst(model.name)] ??= {
      toJSON: function () {
        const linkables = Object.entries(this)
          .filter(([name]) => name !== "toJSON")
          .map(([, object]) => object)
        const lastIndex = linkables.length - 1
        return linkables[lastIndex]
      },
    })

    for (const [property, value] of Object.entries(schema)) {
      if (BaseRelationship.isRelationship(value)) {
        continue
      }

      const parsedProperty = (value as PropertyType<any>).parse(property)
      if (PrimaryKeyModifier.isPrimaryKeyModifier(value)) {
        const linkableKeyName =
          parsedProperty.dataType.options?.linkable ??
          `${camelToSnakeCase(model.name).toLowerCase()}_${property}`
        modelLinkConfig[property] = {
          linkable: linkableKeyName,
          primaryKey: property,
          serviceName,
          field: lowerCaseFirst(model.name),
        }
      }
    }
  }

  return linkConfig as InfersLinksConfig<ServiceName, T>
}

/**
 * @deprecated temporary supports for mikro orm entities to get the linkable available from the module export while waiting for the migration to DML
 *
 * @param serviceName
 * @param linkableKeys
 */
export function buildLinkConfigFromLinkableKeys<
  const ServiceName extends string,
  const T extends Record<string, string>
>(serviceName: ServiceName, linkableKeys: T): Record<string, any> {
  const linkConfig = {} as Record<string, any>

  for (const [linkable, modelName] of Object.entries(linkableKeys)) {
    const kebabCasedModelName = camelToSnakeCase(toCamelCase(modelName))
    const inferredReferenceProperty = linkable.replace(
      `${kebabCasedModelName}_`,
      ""
    )

    const config = {
      linkable: linkable,
      primaryKey: inferredReferenceProperty,
      serviceName,
      field: lowerCaseFirst(modelName),
    }
    linkConfig[lowerCaseFirst(modelName)] = {
      [inferredReferenceProperty]: config,
      toJSON: () => config,
    }
  }

  return linkConfig as Record<string, any>
}

/**
 * Reversed map from linkableKeys to entity name to linkable keys
 * @param linkableKeys
 */
export function buildModelsNameToLinkableKeysMap(
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
