import { MedusaModule } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig, ModuleJoinerRelationship } from "@medusajs/types"
import { camelToSnakeCase, lowerCaseFirst, toPascalCase } from "@medusajs/utils"
import { composeTableName } from "./compose-link-name"

export function generateGraphQLSchema(
  joinerConfig: ModuleJoinerConfig,
  primary: ModuleJoinerRelationship,
  foreign: ModuleJoinerRelationship
) {
  const fieldNames = primary.foreignKey.split(",").concat(foreign.foreignKey)

  const entityName = toPascalCase(
    "Link_" +
      (joinerConfig.databaseConfig?.tableName ??
        composeTableName(
          primary.serviceName,
          primary.foreignKey,
          foreign.serviceName,
          foreign.foreignKey
        ))
  )

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

  let typeDef = `
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

  for (const extend of joinerConfig.extends ?? []) {
    const extendedModule = MedusaModule.getModuleInstance(extend.serviceName)
    if (!extendedModule && !extend.relationship.isInternalService) {
      throw new Error(
        `Module ${extend.serviceName} not found. Please verify that the module is configured and installed, also the module must be loaded before the link modules.`
      )
    }

    const joinerConfig = MedusaModule.getJoinerConfig(extend.serviceName)
    let extendedEntityName =
      joinerConfig?.linkableKeys?.[extend.relationship.primaryKey]!

    if (!extendedEntityName) {
      continue
    }

    extendedEntityName = toPascalCase(extendedEntityName)

    const linkTableFieldName = camelToSnakeCase(
      lowerCaseFirst(extend.relationship.alias)
    )
    const type = extend.relationship.isList ? `[${entityName}]` : entityName

    typeDef += `    
      extend type ${extendedEntityName} {
        ${linkTableFieldName}: ${type}
      }
    `
  }

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
