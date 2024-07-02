import { DMLSchema } from "@medusajs/types"
import { IdProperty } from "../../properties/id"

/**
 * The method is used to infer primary keys from the schema
 */
export function inferPrimaryKeyProperties<TSchema extends DMLSchema>(
  schema: TSchema
) {
  // If explicit primaryKey fields are not found, no inferrence is required. Return early.
  if (!getExplicitPrimaryKeyFields(schema).length) {
    return schema
  }

  // If explicit primaryKey fields are found, set any id() properties to no longer be
  // set to primaryKey.
  for (const [field, property] of Object.entries(schema)) {
    const parsed = property.parse(field)
    const isRelationshipType = "type" in parsed

    if (isRelationshipType) {
      continue
    }
  }

  return schema
}

/*
  Gets all explicit primary key fields from a schema, except id properties.

  eg: model.define('test', {
    id: model.id(), -> implicit primaryKey field,
    text: model.text(),
    textPrimary: model.text().primaryKey(), -> explicit primaryKey field
    numberPrimary: model.number().primaryKey(), -> explicit primaryKey field
    belongsTo: model.belongsTo(() => belongsToAnother),
  })
*/
function getExplicitPrimaryKeyFields(schema: DMLSchema) {
  return Object.entries(schema).filter(([field, property]) => {
    const parsed = property.parse(field)
    const isRelationshipType = "type" in parsed

    // Return early if its a relationship property or an id property
    if (isRelationshipType || parsed.dataType.name === "id") {
      return false
    }

    return !!parsed.dataType.options?.primaryKey
  })
}
