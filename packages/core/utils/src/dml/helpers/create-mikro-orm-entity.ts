import {
  Enum,
  Entity,
  OneToMany,
  Property,
  OneToOne,
  ManyToMany,
  ManyToOne,
} from "@mikro-orm/core"
import { DmlEntity } from "../entity"
import { camelToSnakeCase, pluralize } from "../../common"
import { upperCaseFirst } from "../../common/upper-case-first"
import type {
  Infer,
  SchemaType,
  EntityCascades,
  KnownDataTypes,
  SchemaMetadata,
  RelationshipType,
  EntityConstructor,
  RelationshipMetadata,
} from "../types"
import { HasOne } from "../relations/has-one"
import { HasMany } from "../relations/has-many"

/**
 * DML entity data types to PostgreSQL data types via
 * Mikro ORM.
 *
 * We remove "enum" type from here, because we use a dedicated
 * mikro orm decorator for that
 */
const COLUMN_TYPES: {
  [K in Exclude<KnownDataTypes, "enum">]: string
} = {
  boolean: "boolean",
  dateTime: "timestamptz",
  number: "integer",
  text: "text",
  json: "jsonb",
}

/**
 * DML entity data types to Mikro ORM property
 * types.
 *
 * We remove "enum" type from here, because we use a dedicated
 * mikro orm decorator for that
 */
const PROPERTY_TYPES: {
  [K in Exclude<KnownDataTypes, "enum">]: string
} = {
  boolean: "boolean",
  dateTime: "date",
  number: "number",
  text: "string",
  json: "any",
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
    Enum({
      items: () => field.dataType.options!.choices,
      nullable: field.nullable,
      default: field.defaultValue,
    })(MikroORMEntity.prototype, field.fieldName)
    return
  }

  /**
   * Define rest of properties
   */
  const columnType = COLUMN_TYPES[field.dataType.name]
  const propertyType = PROPERTY_TYPES[field.dataType.name]

  Property({
    columnType,
    type: propertyType,
    nullable: field.nullable,
    default: field.defaultValue,
  })(MikroORMEntity.prototype, field.fieldName)
}

/**
 * Defines has one relationship on the Mikro ORM entity.
 */
function defineHasOneRelationship(
  MikroORMEntity: EntityConstructor<any>,
  relationship: RelationshipMetadata,
  relatedEntity: DmlEntity<
    Record<string, SchemaType<any> | RelationshipType<any>>
  >,
  cascades: EntityCascades<string[]>
) {
  const relatedModelName = upperCaseFirst(relatedEntity.name)
  const shouldRemoveRelated = !!cascades.delete?.includes(relationship.name)

  OneToOne({
    entity: relatedModelName,
    nullable: relationship.nullable,
    mappedBy: relationship.mappedBy || camelToSnakeCase(MikroORMEntity.name),
    cascade: shouldRemoveRelated
      ? (["perist", "soft-remove"] as any)
      : undefined,
  })(MikroORMEntity.prototype, relationship.name)
}

/**
 * Defines has many relationship on the Mikro ORM entity
 */
function defineHasManyRelationship(
  MikroORMEntity: EntityConstructor<any>,
  relationship: RelationshipMetadata,
  relatedEntity: DmlEntity<
    Record<string, SchemaType<any> | RelationshipType<any>>
  >,
  cascades: EntityCascades<string[]>
) {
  const relatedModelName = upperCaseFirst(relatedEntity.name)
  const shouldRemoveRelated = !!cascades.delete?.includes(relationship.name)

  OneToMany({
    entity: relatedModelName,
    orphanRemoval: true,
    mappedBy: relationship.mappedBy || camelToSnakeCase(MikroORMEntity.name),
    cascade: shouldRemoveRelated
      ? (["perist", "soft-remove"] as any)
      : undefined,
  })(MikroORMEntity.prototype, relationship.name)
}

/**
 * Defines belongs to relationship on the Mikro ORM entity. The belongsTo
 * relationship inspects the related entity for the other side of
 * the relationship and then uses one of the following Mikro ORM
 * relationship.
 *
 * - OneToOne: When the other side uses "hasOne" with "owner: true"
 * - ManyToOne: When the other side uses "hasMany"
 */
function defineBelongsToRelationship(
  MikroORMEntity: EntityConstructor<any>,
  relationship: RelationshipMetadata,
  relatedEntity: DmlEntity<
    Record<string, SchemaType<any> | RelationshipType<any>>
  >
) {
  const mappedBy =
    relationship.mappedBy || camelToSnakeCase(MikroORMEntity.name)
  const { schema: relationSchema, cascades: relationCascades } =
    relatedEntity.parse()

  const otherSideRelation = relationSchema[mappedBy]
  const relatedModelName = upperCaseFirst(relatedEntity.name)

  /**
   * In DML the relationships are cascaded from parent to child. A belongsTo
   * relationship is always a child, therefore we look at the parent and
   * define a onDelete: cascade when we are included in the delete
   * list of parent cascade.
   */
  const shouldCascade = relationCascades.delete?.includes(mappedBy)

  /**
   * Ensure the mapped by is defined as relationship on the other side
   */
  if (!otherSideRelation) {
    throw new Error(
      `Missing property "${mappedBy}" on "${relatedEntity.name}" entity. Make sure to define it as a relationship`
    )
  }

  /**
   * Otherside is a has many. Hence we should defined a ManyToOne
   */
  if (otherSideRelation instanceof HasMany) {
    ManyToOne({
      entity: relatedModelName,
      columnType: "text",
      mapToPk: true,
      fieldName: camelToSnakeCase(`${relationship.name}Id`),
      nullable: relationship.nullable,
      onDelete: shouldCascade ? "cascade" : undefined,
    })(MikroORMEntity.prototype, camelToSnakeCase(`${relationship.name}Id`))

    ManyToOne({
      entity: relatedModelName,
      persist: false,
    })(MikroORMEntity.prototype, relationship.name)
    return
  }

  /**
   * Otherside is a has one. Hence we should defined a OneToOne
   */
  if (otherSideRelation instanceof HasOne) {
    OneToOne({
      entity: relatedModelName,
      nullable: relationship.nullable,
      mappedBy: mappedBy,
      owner: true,
      onDelete: shouldCascade ? "cascade" : undefined,
    })(MikroORMEntity.prototype, relationship.name)
    return
  }

  /**
   * Other side is some unsupported data-type
   */
  throw new Error(
    `Invalid relationship reference for "${mappedBy}" on "${relatedEntity.name}" entity. Make sure to define a hasOne or hasMany relationship`
  )
}

/**
 * Defines a many to many relationship on the Mikro ORM entity
 */
function defineManyToManyRelationship(
  MikroORMEntity: EntityConstructor<any>,
  relationship: RelationshipMetadata,
  relatedEntity: DmlEntity<
    Record<string, SchemaType<any> | RelationshipType<any>>
  >,
  cascades: EntityCascades<string[]>
) {
  const relatedModelName = upperCaseFirst(relatedEntity.name)
  ManyToMany({
    entity: relatedModelName,
    mappedBy: relationship.mappedBy as any,
  })(MikroORMEntity.prototype, relationship.name)
}

/**
 * Defines a DML entity schema field as a Mikro ORM relationship
 */
function defineRelationship(
  MikroORMEntity: EntityConstructor<any>,
  relationship: RelationshipMetadata,
  cascades: EntityCascades<string[]>
) {
  /**
   * We expect the relationship.entity to be a function that
   * lazily returns the related entity
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

  /**
   * Defining relationships
   */
  switch (relationship.type) {
    case "hasOne":
      defineHasOneRelationship(
        MikroORMEntity,
        relationship,
        relatedEntity,
        cascades
      )
      break
    case "hasMany":
      defineHasManyRelationship(
        MikroORMEntity,
        relationship,
        relatedEntity,
        cascades
      )
      break
    case "belongsTo":
      defineBelongsToRelationship(MikroORMEntity, relationship, relatedEntity)
      break
    case "manyToMany":
      defineManyToManyRelationship(
        MikroORMEntity,
        relationship,
        relatedEntity,
        cascades
      )
      break
  }
}

/**
 * A helper function to define a Mikro ORM entity from a
 * DML entity.
 * @todo: Handle soft deleted indexes and filters
 * @todo: Finalize if custom pivot entities are needed
 */
export function createMikrORMEntity<T extends DmlEntity<any>>(
  entity: T
): Infer<T> {
  class MikroORMEntity {}
  const { name, schema, cascades } = entity.parse()

  const className = upperCaseFirst(name)
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
  Object.entries(schema).forEach(([name, property]) => {
    const field = property.parse(name)
    if ("fieldName" in field) {
      defineProperty(MikroORMEntity, field)
    } else {
      defineRelationship(MikroORMEntity, field, cascades)
    }
  })

  /**
   * Converting class to a MikroORM entity
   */
  return Entity({ tableName })(MikroORMEntity) as Infer<T>
}
