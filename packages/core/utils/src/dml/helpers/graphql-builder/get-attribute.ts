import { PropertyType } from "@medusajs/types"
import { toPascalCase } from "../../../common"
import { PrimaryKeyModifier } from "../../properties/primary-key"

/*
 * Map of DML data types to GraphQL types
 */
const GRAPHQL_TYPES = {
  boolean: "Boolean",
  dateTime: "DateTime",
  number: "Int",
  bigNumber: "String",
  text: "String",
  json: "JSON",
  array: "[String]",
  id: "ID",
}

/**
 * Defines a DML entity schema field as a Mikro ORM property
 */
export function getGraphQLAttributeFromDMLPropety(
  modelName: string,
  propertyName: string,
  property: PropertyType<any>
): {
  enum?: string
  attribute: string
} {
  const field = property.parse(propertyName)
  const fieldType = PrimaryKeyModifier.isPrimaryKeyModifier(property)
    ? "id"
    : field.dataType.name

  let enumSchema: string | undefined
  let gqlAttr: {
    property: string
    type: string
  }

  const specialType = {
    enum: () => {
      const enumName = toPascalCase(modelName + "_" + field.fieldName + "Enum")
      const enumValues = field.dataType
        .options!.choices.map((value) => {
          const enumValue = value.replace(/[^a-z0-9_]/gi, "_").toUpperCase()
          return `  ${enumValue}`
        })
        .join("\n")

      enumSchema = `enum ${enumName} {\n${enumValues}\n}`
      gqlAttr = {
        property: field.fieldName,
        type: enumName,
      }
    },
    id: () => {
      gqlAttr = {
        property: field.fieldName,
        type: GRAPHQL_TYPES.id,
      }
    },
  }

  if (specialType[fieldType]) {
    specialType[fieldType]()
  } else {
    gqlAttr = {
      property: field.fieldName,
      type: GRAPHQL_TYPES[fieldType] ?? "String",
    }
  }

  if (!field.nullable) {
    gqlAttr!.type += "!"
  }

  return {
    enum: enumSchema,
    attribute: `${gqlAttr!.property}: ${gqlAttr!.type}`,
  }
}
