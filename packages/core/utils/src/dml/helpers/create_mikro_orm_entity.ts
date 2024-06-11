import {
  Entity,
  OneToMany,
  Property,
  OneToOne,
  ManyToMany,
  Enum,
} from "@mikro-orm/core"
import { DmlEntity } from "../entity"
import { camelToSnakeCase, pluralize } from "../../common"
import { upperCaseFirst } from "../../common/upper-case-first"
import type {
  Infer,
  SchemaType,
  KnownDataTypes,
  RelationshipType,
  SchemaMetadata,
  EntityConstructor,
  RelationshipMetadata,
} from "../types"

/**
 * DML entity data types to PostgreSQL data types via
 * Mikro ORM
 */
const COLUMN_TYPES: {
  [K in KnownDataTypes]: string
} = {
  boolean: "boolean",
  dateTime: "timestamptz",
  number: "integer",
  string: "text",
  json: "jsonb",
  enum: "enum",
}

/**
 * Defines a DML entity schema field as a Mikro ORM property
 */
function defineProperty(
  MikroORMEntity: EntityConstructor<any>,
  field: SchemaMetadata
) {
  /**
   * Defining an enum property
   */
  if (field.dataType.name === "enum") {
    Enum({ items: () => field.dataType.options!.choices })(
      MikroORMEntity.prototype,
      field.fieldName
    )
    return
  }

  const columnType = COLUMN_TYPES[field.dataType.name]
  Property({ columnType, type: field.dataType.name })(
    MikroORMEntity.prototype,
    field.fieldName
  )
}

/**
 * Defines a DML entity schema field as a Mikro ORM relationship
 */
function defineRelationship(
  MikroORMEntity: EntityConstructor<any>,
  relationship: RelationshipMetadata
) {
  /**
   * Defining relationships
   */
  const relatedEntity =
    typeof relationship.entity === "function"
      ? (relationship.entity() as unknown)
      : undefined

  /**
   * Since we don't type-check relationships, we should validate
   * them at runtime
   */
  if (!relatedEntity) {
    throw new Error(
      `Invalid relationship reference for "${MikroORMEntity.name}.${relationship.name}". Make sure to define the relationship using a factory function`
    )
  }

  /**
   * Ensure the return value is a DML entity instance
   */
  if (!(relatedEntity instanceof DmlEntity)) {
    throw new Error(
      `Invalid relationship reference for "${MikroORMEntity.name}.${relationship.name}". Make sure to return a DML entity from the relationship callback`
    )
  }

  const relatedModelName = upperCaseFirst(relatedEntity.name)

  /**
   * Defining relationships
   */
  switch (relationship.type) {
    case "hasOne":
      OneToOne({ entity: relatedModelName, mappedBy: "" })(
        MikroORMEntity.prototype,
        relationship.name
      )
      break
    case "hasMany":
      OneToMany({ entity: relatedModelName, mappedBy: "" })(
        MikroORMEntity.prototype,
        relationship.name
      )
      break
    case "manyToMany":
      ManyToMany({ entity: relatedModelName, mappedBy: "" })(
        MikroORMEntity.prototype,
        relationship.name
      )
      break
  }
}

/**
 * A helper function to define a Mikro ORM entity from a
 * DML entity.
 */
export function createMikrORMEntity<
  T extends DmlEntity<Record<string, SchemaType<any> | RelationshipType<any>>>
>(entity: T): Infer<T> {
  class MikroORMEntity {}

  const className = upperCaseFirst(entity.name)
  const tableName = pluralize(camelToSnakeCase(className))

  /**
   * Assigning name to the class constructor, so that it matches
   * the DML entity name
   */
  Object.defineProperty(MikroORMEntity, "name", {
    get: function () {
      return className
    },
  })

  /**
   * Processing schema fields
   */
  Object.keys(entity.schema).forEach((property) => {
    const field = entity.schema[property].parse(property)
    if ("fieldName" in field) {
      defineProperty(MikroORMEntity, field)
    } else {
      defineRelationship(MikroORMEntity, field)
    }
  })

  /**
   * Converting class to a MikroORM entity
   */
  return Entity({ tableName })(MikroORMEntity) as Infer<T>
}
