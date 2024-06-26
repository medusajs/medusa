import { DMLSchema } from "../../entity-builder"
import { IdProperty } from "../../properties/id"

/*
  The id() property is an core opinionated property that will act as a primaryKey
  by default and come with built-in logic when converted to a mikroorm entity. If no other
  primaryKey() properties are found within the schema, we continue treating the id() property 
  as a primaryKey. When other fields are set as explicit primaryKey fields, we convert the 
  id() property to no longer be a primaryKey. 

  Example:
  Model 1:
    id: model.id() -> primary key
    code: model.text()

  Model 2:
    id: model.id()
    code: model.text().primaryKey() -> primary key

  Model 3:
    id: model.id()
    code: model.text().primaryKey() -> composite primary key
    name: model.text().primaryKey() -> composite primary key
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

    if (parsed.dataType.name === "id") {
      ;(property as IdProperty).primaryKey(false)
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
