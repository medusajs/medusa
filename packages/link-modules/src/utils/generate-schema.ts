import { ModuleJoinerConfig, ModuleJoinerRelationship } from "@medusajs/types"
import { lowerCaseFirst, toPascalCase } from "@medusajs/utils"
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
  const primaryField = `${lowerCaseFirst(
    composeTableName(primary.serviceName)
  )}: ${toPascalCase(composeTableName(primary.serviceName))}`

  const foreignField = `${lowerCaseFirst(
    toPascalCase(composeTableName(foreign.serviceName))
  )}: ${toPascalCase(composeTableName(foreign.serviceName))}`

  let typeDef = `
    type ${entityName} {
      ${(Object.entries(fields) as any)
        .map(
          ([field, { type, nullable }]) =>
            `${field}: ${nullable ? type : `${type}!`}`
        )
        .join("\n      ")}
        
      ${primaryField}!
      ${foreignField}!
      
      createdAt: String!
      updatedAt: String!
      deletedAt: String
    }
  `

  for (const extend of joinerConfig.extends ?? []) {
    const extendedEntityName = toPascalCase(
      composeTableName(extend.serviceName)
    )
    const linkTableFieldName = lowerCaseFirst(entityName)
    const type = extend.relationship.isList ? `[${entityName}!]` : entityName

    typeDef += `
    
      extend type ${extendedEntityName} {
        ${linkTableFieldName}: ${type}!
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

// Testing output
/*const typeDefs = generateGraphQLSchema(
  ProductShippingProfile,
  ProductShippingProfile.relationships![0],
  ProductShippingProfile.relationships![1]
)
console.log(typeDefs)*/
