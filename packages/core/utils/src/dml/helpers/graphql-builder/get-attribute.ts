import { PropertyType } from "@medusajs/types"
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
  }[] = []

  const specialType = {
    enum: () => {
      const enumName = field.fieldName + "Enum"

      const enumValues = field.dataType
        .options!.choices.forEach((value) => {
          return `  ${value}`
        })
        .join("\n")

      enumSchema = `enum ${enumName} {\n${enumValues}}\n}`

      gqlAttr.push({
        property: field.fieldName,
        type: enumName,
      })
    },
    id: () => {
      gqlAttr.push({
        property: field.fieldName,
        type: GRAPHQL_TYPES.id,
      })
    },
  }

  if (specialType[fieldType]) {
    specialType[fieldType]()
  } else {
    gqlAttr.push({
      property: field.fieldName,
      type: GRAPHQL_TYPES[fieldType] ?? "String",
    })
  }

  if (!field.nullable) {
    gqlAttr.forEach((attr) => {
      attr.type += "!"
    })
  }

  let gqlSchema: string[] = []
  gqlAttr.forEach((attr) => {
    gqlSchema.push(`${attr.property}: ${attr.type}`)
  })

  return {
    enum: enumSchema,
    attribute: gqlSchema.join("\n"),
  }
}
