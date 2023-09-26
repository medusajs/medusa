import { ModuleJoinerConfig, ModuleJoinerRelationship } from "@medusajs/types"
import { toPascalCase } from "@medusajs/utils"
import { composeTableName } from "./compose-link-name"

export function generateGraphQLSchema(
  joinerConfig: ModuleJoinerConfig,
  primary: ModuleJoinerRelationship,
  foreign: ModuleJoinerRelationship
) {
  const fieldNames = primary.foreignKey.split(",").concat(foreign.foreignKey)

  const entityName = toPascalCase(
    "Link " +
      (joinerConfig.databaseConfig?.tableName ??
        composeTableName(
          primary.serviceName,
          primary.foreignKey,
          foreign.serviceName,
          foreign.foreignKey
        ))
  )

  const fields = fieldNames.reduce((acc, curr) => {
    acc[curr] = {
      type: "String!",
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

  const typeDef = `
type ${entityName} {
  ${(Object.entries(fields) as any)
    .map(
      ([field, { type, nullable }]) =>
        `${field}: ${nullable ? type : `${type}!`}`
    )
    .join("\n  ")}
  createdAt: String!
  updatedAt: String!
  deletedAt: String
}
`
  // TODO: read extends from joinerConfig to inject relations in other modules
  // Add Entity to the relation, so fields can be linked directly to Entities of other modules.

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
