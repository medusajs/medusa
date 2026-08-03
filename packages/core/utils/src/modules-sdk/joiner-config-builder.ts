import {
  IDmlEntity,
  JoinerServiceConfigAlias,
  ModuleJoinerConfig,
  PropertyType,
} from "@medusajs/types"
import { accessSync } from "fs"
import * as path from "path"
import { dirname, join, normalize } from "path"
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
import { DmlEntity, IdProperty, parseEntityName } from "../dml"
import { toGraphQLSchema } from "../dml/helpers/create-graphql"
import { PrimaryKeyModifier } from "../dml/properties/primary-key"
import { BaseRelationship } from "../dml/relations/base"
import { BelongsTo } from "../dml/relations/belongs-to"
import { loadModels } from "./loaders/load-models"
import { InferLinkableKeys, InfersLinksConfig } from "./types/links-config"

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
    idPrefixToEntityName,
  }: {
    alias?: JoinerServiceConfigAlias[]
    idPrefixToEntityName?: Record<string, string>
    schema?: string
    models?: DmlEntity<any, any>[] | { name: string }[]
    linkableKeys?: ModuleJoinerConfig["linkableKeys"]
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

      fullPath = normalize(fullPath)
      const integrationTestPotentialPath = normalize(
        "integration-tests/__tests__"
      )

      /**
       * Handle integration-tests/__tests__ path based on conventional naming
       */
      if (fullPath.includes(integrationTestPotentialPath)) {
        const sourcePath = fullPath.split(integrationTestPotentialPath)[0]
        fullPath = path.join(sourcePath, "src")
      }

      const srcDir = fullPath.includes("dist") ? "dist" : "src"
      const splitPath = fullPath.split(srcDir)

      let basePath = splitPath[0] + srcDir

      const potentialModulesDirPathSegment = normalize(`${srcDir}/modules/`)
      const isMedusaProject = fullPath.includes(potentialModulesDirPathSegment)
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

  if (!schema) {
    schema = toGraphQLSchema([...modelDefinitions.values()])
  }

  if (!idPrefixToEntityName) {
    idPrefixToEntityName = buildIdPrefixToEntityNameFromDmlObjects([
      ...modelDefinitions.values(),
    ])
  }

  const linkableKeysFromDml = buildLinkableKeysFromDmlObjects([
    ...modelDefinitions.values(),
  ])
  const linkableKeysFromMikroOrm = buildLinkableKeysFromMikroOrmObjects([
    ...mikroOrmObjects.values(),
  ])

  const mergedLinkableKeys = {
    ...linkableKeysFromDml,
    ...linkableKeysFromMikroOrm,
    ...linkableKeys,
  }
  linkableKeys = mergedLinkableKeys

  /**
   * Merge custom primary keys from the joiner config with the infered primary keys
   * from the models.
   *
   * TODO: Maybe worth looking into the real needs for primary keys.
   * It can happen that we could just remove that but we need to investigate (looking at the
   * lookups from the remote joiner to identify which entity a property refers to)
   */
  primaryKeys ??= []
  const finalPrimaryKeys = new Set(primaryKeys)
  if (modelDefinitions.size) {
    const linkConfig = buildLinkConfigFromModelObjects(
      serviceName,
      Object.fromEntries(modelDefinitions)
    )

    Object.values(linkConfig).flatMap((entityLinkConfig) => {
      return Object.values(
        entityLinkConfig as Record<string, { primaryKey: string }>
      )
        .filter((linkableConfig) => isObject(linkableConfig))
        .forEach((linkableConfig) => {
          finalPrimaryKeys.add(linkableConfig.primaryKey)
        })
    })
  }

  primaryKeys = Array.from(finalPrimaryKeys.add("id"))

  const crossModuleJoinMetadataByEntity =
    buildCrossModuleJoinMetadataFromDmlObjects(
      Array.from(modelDefinitions.values())
    )

  // TODO: In the context of DML add a validation on primary keys and linkable keys if the consumer provide them manually. follow up pr

  return {
    serviceName,
    primaryKeys,
    schema,
    idPrefixToEntityName,
    linkableKeys: linkableKeys,
    alias: [
      ...(alias ?? ([] as any)).map((aliasConfig) => ({
        name: aliasConfig.name,
        entity: aliasConfig.entity,
        filterable: aliasConfig.filterable,
        ...(crossModuleJoinMetadataByEntity[aliasConfig.entity]
          ? {
              __internal: crossModuleJoinMetadataByEntity[aliasConfig.entity],
            }
          : {}),
        args: {
          methodSuffix:
            aliasConfig.args?.methodSuffix ??
            pluralize(upperCaseFirst(aliasConfig.entity)),
        },
      })),
      ...deduplicatedLoadedModels
        .filter((model) => {
          return (
            !alias ||
            !alias.some((alias) => alias.entity === upperCaseFirst(model.name))
          )
        })
        .map((entity) => {
          const entityName = upperCaseFirst(entity.name)
          const crossModuleJoinMetadata =
            crossModuleJoinMetadataByEntity[entityName]

          return {
            name: [
              `${camelToSnakeCase(entity.name).toLowerCase()}`,
              `${pluralize(camelToSnakeCase(entity.name).toLowerCase())}`,
            ],
            entity: entityName,
            ...(crossModuleJoinMetadata
              ? {
                  __internal: crossModuleJoinMetadata,
                }
              : {}),
            args: {
              methodSuffix: pluralize(entityName),
            },
          }
        }),
    ],
  }
}

type CrossModuleJoinAliasMetadata = NonNullable<
  JoinerServiceConfigAlias["__internal"]
>

type InternalRelationMetadata = NonNullable<
  CrossModuleJoinAliasMetadata["relations"]
>[string]

/**
 * Build cross-module join metadata from DML entity definitions.
 * Crossjoinable fields are all non-computed DML properties, and relations
 * describe how module-internal DML relations join at the SQL level. Together
 * with the physical table name they determine what optimizations for
 * cross-module joins can be performed.
 */
function buildCrossModuleJoinMetadataFromDmlObjects(
  models: DmlEntity<any, any>[]
): Record<string, CrossModuleJoinAliasMetadata> {
  const metadata: Record<string, CrossModuleJoinAliasMetadata> = {}

  for (const model of models) {
    if (!DmlEntity.isDmlEntity(model)) {
      continue
    }

    const entityName = upperCaseFirst(model.name)
    const { tableNameWithoutSchema, pgSchema } = parseEntityName(model)

    const crossjoinable: string[] = []
    const relations: Record<string, InternalRelationMetadata> = {}

    for (const [property, value] of Object.entries(model.schema)) {
      if (BaseRelationship.isRelationship(value)) {
        const relationMetadata = deriveInternalRelationMetadata(
          model,
          property,
          value
        )

        if (relationMetadata) {
          relations[property] = relationMetadata

          // belongsTo foreign keys are real columns on this table (e.g.
          // price.price_list_id) and are filterable like any other column.
          if (relationMetadata.foreignKeyOwner === "self") {
            crossjoinable.push(relationMetadata.foreignKey)
          }
        }
        continue
      }

      const parsedProperty = (value as PropertyType<any>).parse(property)

      if (parsedProperty.computed) {
        continue
      }

      crossjoinable.push(property)
    }

    metadata[entityName] = {
      crossjoinable: deduplicate(crossjoinable),
      tableName: tableNameWithoutSchema,
      ...(pgSchema ? { schema: pgSchema } : {}),
      ...(Object.keys(relations).length ? { relations } : {}),
    }
  }

  return metadata
}

/**
 * Derive the SQL join shape of a module-internal DML relation. Only hasMany
 * and belongsTo have a statically known join column; other relation kinds
 * (hasOne, manyToMany) are skipped and stay untraversable for cross-module
 * SQL joins.
 */
function deriveInternalRelationMetadata(
  model: DmlEntity<any, any>,
  property: string,
  relationship: unknown
): InternalRelationMetadata | undefined {
  const parsed = (
    relationship as { parse: (name: string) => Record<string, any> }
  ).parse(property)

  const referenced =
    typeof parsed.entity === "function" ? parsed.entity() : parsed.entity

  if (!DmlEntity.isDmlEntity(referenced)) {
    return undefined
  }

  const relatedEntityName = upperCaseFirst(referenced.name)

  if (parsed.type === "belongsTo") {
    const foreignKey =
      parsed.options?.foreignKeyName ?? camelToSnakeCase(`${property}Id`)

    return {
      entity: relatedEntityName,
      foreignKey,
      foreignKeyOwner: "self",
    }
  }

  if (parsed.type === "hasMany") {
    // The join column lives on the related model, defined by its belongsTo
    // inverse (mirrors defineRelationship's OneToMany mapping).
    const mappedBy =
      parsed.mappedBy ??
      camelToSnakeCase(upperCaseFirst(toCamelCase(model.name)))

    const inverse = referenced.schema[mappedBy]
    if (!inverse || !BelongsTo.isBelongsTo(inverse)) {
      return undefined
    }

    const inverseParsed = (
      inverse as unknown as { parse: (name: string) => Record<string, any> }
    ).parse(mappedBy)
    const foreignKey =
      inverseParsed.options?.foreignKeyName ??
      camelToSnakeCase(`${mappedBy}Id`)

    return {
      entity: relatedEntityName,
      foreignKey,
      foreignKeyOwner: "target",
      isList: true,
    }
  }

  return undefined
}

/**
 * Build the id prefix to entity name map from the DML objects
 * @param models
 */
export function buildIdPrefixToEntityNameFromDmlObjects(
  models: DmlEntity<any, any>[]
): Record<string, string> {
  return models.reduce((acc, model) => {
    const id = model.parse().schema.id as
      | IdProperty
      | PrimaryKeyModifier<any, any>

    if (
      PrimaryKeyModifier.isPrimaryKeyModifier(id) &&
      id.schema.dataType.options.prefix
    ) {
      acc[id.schema.dataType.options.prefix] = model.name
    } else if (IdProperty.isIdProperty(id) && id.dataType.options.prefix) {
      acc[id.dataType.options.prefix] = model.name
    }

    return acc
  }, {})
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
>(
  serviceName: ServiceName,
  models: T,
  linkableKeys: Record<string, string> = {}
): InfersLinksConfig<ServiceName, T> {
  // In case some models have been provided to a custom joiner config, the linkable will be limited
  // to that set of models. We dont want to expose models that should not be linkable.
  const linkableModels = Object.values(linkableKeys)
  const linkConfig = {} as InfersLinksConfig<ServiceName, T>

  for (const model of Object.values(models) ?? []) {
    const classLikeModelName = upperCaseFirst(model.name)

    if (
      !DmlEntity.isDmlEntity(model) ||
      (linkableModels.length && !linkableModels.includes(classLikeModelName))
    ) {
      continue
    }

    const schema = model.schema

    /**
     * When using a linkable, if a specific linkable property is not specified, the toJSON
     * function will be called and return the first linkable available for this model.
     */
    const modelLinkConfig = (linkConfig[lowerCaseFirst(model.name)] ??= {
      toJSON: function () {
        const linkables = Object.entries(this)
          .filter(([name]) => name !== "toJSON")
          .map(([, object]) => object)
        return linkables[0]
      },
    })

    /**
     * Build all linkable properties for the model
     */
    for (const [property, value] of Object.entries(schema)) {
      if (BaseRelationship.isRelationship(value)) {
        continue
      }

      const parsedProperty = (value as PropertyType<any>).parse(property)
      if (
        PrimaryKeyModifier.isPrimaryKeyModifier(value) ||
        IdProperty.isIdProperty(value)
      ) {
        const linkableKeyName =
          parsedProperty.dataType.options?.linkable ??
          `${camelToSnakeCase(model.name).toLowerCase()}_${property}`

        modelLinkConfig[property] = {
          linkable: linkableKeyName,
          primaryKey: property,
          serviceName,
          field: lowerCaseFirst(model.name),
          entity: classLikeModelName,
        }
      }
    }
  }

  /**
   * If the joiner config specify some custom linkable keys, we merge them with the
   * existing linkable keys infered from the model above.
   */
  for (const [linkableKey, modelName] of Object.entries(linkableKeys) ?? []) {
    const snakeCasedModelName = camelToSnakeCase(toCamelCase(modelName))

    // Linkable keys by default are prepared with snake cased model name _id
    // So to be able to compare only the property we have to remove the first part
    const inferredReferenceProperty = linkableKey.replace(
      `${snakeCasedModelName}_`,
      ""
    )

    linkConfig[lowerCaseFirst(modelName)] ??= {
      toJSON: function () {
        const linkables = Object.entries(this)
          .filter(([name]) => name !== "toJSON")
          .map(([, object]) => object)
        return linkables[0]
      },
    }

    if (linkConfig[lowerCaseFirst(modelName)][inferredReferenceProperty]) {
      continue
    }

    linkConfig[lowerCaseFirst(modelName)][inferredReferenceProperty] = {
      linkable: linkableKey,
      primaryKey: inferredReferenceProperty,
      serviceName,
      field: lowerCaseFirst(modelName),
      entity: upperCaseFirst(modelName),
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

    const keyName = lowerCaseFirst(modelName)
    const config = {
      linkable: linkable,
      primaryKey: inferredReferenceProperty,
      serviceName,
      field: keyName,
      entity: upperCaseFirst(modelName),
    }

    linkConfig[keyName] ??= {
      toJSON: () => config,
    }
    linkConfig[keyName][inferredReferenceProperty] = config
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
