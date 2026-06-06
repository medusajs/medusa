import { MedusaModule } from "@zjedene-medusa/framework/modules-sdk"
import {
  ModuleJoinerConfig,
  ModuleJoinerRelationship,
} from "@zjedene-medusa/framework/types"
import {
  camelToSnakeCase,
  composeTableName,
  isString,
  lowerCaseFirst,
  toPascalCase,
} from "@zjedene-medusa/framework/utils"

export function generateGraphQLSchema(
  joinerConfig: ModuleJoinerConfig,
  primary: ModuleJoinerRelationship,
  foreign: ModuleJoinerRelationship,
  { logger }: { logger } = { logger: console }
) {
  let fieldNames!: string[]
  let entityName!: string

  const isReadOnlyLink = joinerConfig.isReadOnlyLink
  if (!isReadOnlyLink) {
    fieldNames = primary.foreignKey.split(",").concat(foreign.foreignKey)

    entityName = toPascalCase(
      "Link_" +
        (joinerConfig.databaseConfig?.tableName ??
          composeTableName(
            primary.serviceName,
            primary.foreignKey,
            foreign.serviceName,
            foreign.foreignKey
          ))
    )
  }

  let typeDef = ""

  for (const extend of joinerConfig.extends ?? []) {
    const extendedModule = MedusaModule.getModuleInstance(extend.serviceName)
    if (!extendedModule) {
      throw new Error(
        `Module ${extend.serviceName} not found. Please verify that the module is configured and installed, also the module must be loaded before the link modules.`
      )
    }

    let extendedEntityName =
      extendedModule[extend.serviceName].__joinerConfig.linkableKeys[
        extend.relationship.primaryKey
      ]

    if (!isReadOnlyLink && (!primary || !foreign || !extendedEntityName)) {
      logger.warn(
        `Link modules schema: No linkable key found for ${extend.relationship.primaryKey} on module ${extend.serviceName}.`
      )

      continue
    }

    const fieldName = camelToSnakeCase(
      lowerCaseFirst(extend.relationship.alias)
    )

    let type = extend.relationship.isList ? `[${entityName}]` : entityName
    if (joinerConfig?.isReadOnlyLink) {
      // TODO: In readonly links, the relationship of the extend where entity is undefined has to be applied on all entities in the module that have the relationshiop foreing key attribute (unkown in this context)
      if (!extend.entity) {
        continue
      }

      const rel = extend.relationship
      const extendedService = MedusaModule.getModuleInstance(rel.serviceName)

      const hasGraphqlSchema =
        !!extendedService[rel.serviceName].__joinerConfig.schema
      const relEntity = rel.entity
        ? rel.entity
        : extendedService[rel.serviceName].__joinerConfig.linkableKeys[
            rel.primaryKey
          ]

      if (!relEntity || !hasGraphqlSchema) {
        continue
      }

      type = rel.isList ? `[${relEntity}]` : relEntity!
      extendedEntityName = extend.entity
    }

    /**
     * Find the field aliases shortcut to extend the entity with it
     */
    const fieldsAliasesField = Object.entries(extend.fieldAlias || {})
      .map(([field, config]) => {
        const path = isString(config) ? config : config.path
        const isList = isString(config)
          ? extend.relationship.isList
          : config.isList ?? extend.relationship.isList

        const targetEntityAlias = path.split(".").pop()

        const targetEntityRelation = joinerConfig.relationships?.find(
          (relation) => relation.alias === targetEntityAlias
        )

        if (!targetEntityRelation) {
          return
        }

        const targetEntityName = MedusaModule.getJoinerConfig(
          targetEntityRelation.serviceName
        ).linkableKeys?.[targetEntityRelation.foreignKey]

        if (!targetEntityName) {
          logger.warn(
            `Link modules schema: No linkable key found for ${targetEntityRelation.foreignKey} on module ${targetEntityRelation.serviceName}.`
          )

          return
        }

        // TODO: Re visit field aliases that access properties from a type
        /*const targetEntityType = `${targetEntityName}${
          relationshipPropertyPath.length
            ? relationshipPropertyPath.reduce((acc, value) => {
                return `${acc}[${value}]`
              }, targetEntityName)
            : ""
        }`*/

        return `${field}: ${
          isList ? `[${targetEntityName}]` : targetEntityName
        }`
      })
      .filter(Boolean)

    typeDef += `    
      extend type ${extendedEntityName} {
        ${fieldName}: ${type}
        
        ${fieldsAliasesField.join("\n")}
      }
    `
  }

  if (isReadOnlyLink) {
    return typeDef
  }

  // Pivot table fields
  const fields = fieldNames.reduce((acc, curr) => {
    acc[curr] = {
      type: "String",
      nullable: false,
    }
    return acc
  }, {})

  const extraFields = joinerConfig.databaseConfig?.extraFields ?? {}

  for (const column in extraFields) {
    fields[column] = {
      type: getGraphQLType(extraFields[column].type),
      nullable: !!extraFields[column].nullable,
    }
  }

  // TODO: temporary, every module might always expose their schema
  const doesPrimaryExportSchema = !!MedusaModule.getJoinerConfig(
    primary.serviceName
  )?.schema
  const doesForeignExportSchema = !!MedusaModule.getJoinerConfig(
    foreign.serviceName
  )?.schema

  // Link table relationships
  const primaryField = doesPrimaryExportSchema
    ? `${camelToSnakeCase(primary.alias)}: ${toPascalCase(
        primary.entity ?? composeTableName(primary.serviceName)
      )}`
    : ""

  const foreignField = doesForeignExportSchema
    ? `${camelToSnakeCase(foreign.alias)}: ${toPascalCase(
        foreign.entity ?? composeTableName(foreign.serviceName)
      )}`
    : ""

  typeDef += `
    type ${entityName} {
      ${(Object.entries(fields) as any)
        .map(
          ([field, { type, nullable }]) =>
            `${field}: ${nullable ? type : `${type}!`}`
        )
        .join("\n      ")}
        
      ${primaryField}
      ${foreignField}
      
      createdAt: String!
      updatedAt: String!
      deletedAt: String
    }
  `

  return typeDef
}

function getGraphQLType(type) {
  const typeDef = {
    numeric: "Float",
    integer: "Int",
    smallint: "Int",
    tinyint: "Int",
    mediumint: "Int",
    float: "Float",
    double: "Float",
    boolean: "Boolean",
    decimal: "Float",
    string: "String",
    uuid: "ID",
    text: "String",
    date: "Date",
    time: "Time",
    datetime: "DateTime",
    bigint: "BigInt",
    blob: "Blob",
    uint8array: "[Int]",
    array: "[String]",
    enumArray: "[String]",
    enum: "String",
    json: "JSON",
    jsonb: "JSON",
  }

  return typeDef[type] ?? "String"
}
