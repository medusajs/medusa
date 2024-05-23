import { MedusaModule } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig, ModuleJoinerRelationship } from "@medusajs/types"
import { camelToSnakeCase, lowerCaseFirst, toPascalCase } from "@medusajs/utils"
import { composeTableName } from "./compose-link-name"

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

    const extJoinerConfig = MedusaModule.getJoinerConfig(
      extend.relationship.serviceName
    )
    let extendedEntityName =
      extJoinerConfig?.linkableKeys?.[extend.relationship.foreignKey]!

    if (!isReadOnlyLink && !extendedEntityName && (!primary || !foreign)) {
      logger.warn(
        `Link modules schema: No linkable key found for ${extend.relationship.foreignKey} on module ${extend.relationship.serviceName}.`
      )

      continue
    }

    const fieldName = camelToSnakeCase(
      lowerCaseFirst(extend.relationship.alias)
    )

    let type = extend.relationship.isList ? `[${entityName}]` : entityName
    if (extJoinerConfig?.isReadOnlyLink) {
      type = extend.relationship.isList
        ? `[${extendedEntityName}]`
        : extendedEntityName
    }

    typeDef += `    
      extend type ${extend.serviceName} {
        ${fieldName}: ${type}
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

  // Link table relationships
  const primaryField = `${camelToSnakeCase(primary.alias)}: ${toPascalCase(
    composeTableName(primary.serviceName)
  )}`

  const foreignField = `${camelToSnakeCase(foreign.alias)}: ${toPascalCase(
    composeTableName(foreign.serviceName)
  )}`

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
