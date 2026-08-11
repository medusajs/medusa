import { CamelCase, Prettify } from "../common"
import { SchemaPropertyMetadata } from "../schema"

/**
 * Representation of DML schema. It must be a key-value pair
 * with string based keys and properties/relationships
 * as the value.
 */
export type DMLSchema = Record<
  string,
  PropertyType<any> | RelationshipType<any>
>

/**
 * The configuration for a DML entity. Can be a string (used as the table name)
 * or an object with optional name and required table name.
 */
export type IDmlEntityConfig =
  | string
  | {
      name?: string
      tableName: string
    }

/**
 * Infers the camel-cased entity name from a DML entity configuration.
 */
export type InferDmlEntityNameFromConfig<TConfig extends IDmlEntityConfig> =
  TConfig extends string
    ? CamelCase<TConfig>
    : TConfig extends { name: string }
    ? CamelCase<TConfig["name"]>
    : TConfig extends { tableName: string }
    ? CamelCase<TConfig["tableName"]>
    : never

/**
 * Representation of a DML entity
 */
export interface IDmlEntity<
  Schema extends DMLSchema,
  Config extends IDmlEntityConfig
> {
  name: InferDmlEntityNameFromConfig<Config>
  schema: Schema
}

/**
 * The supported data types
 */
export type KnownDataTypes =
  | "text"
  | "boolean"
  | "enum"
  | "number"
  | "bigNumber"
  | "float"
  | "serial"
  | "dateTime"
  | "array"
  | "json"
  | "id"

/**
 * List of available relationships at DML level
 */
export type RelationshipTypes =
  | "hasOne"
  | "hasOneWithFK"
  | "hasMany"
  | "belongsTo"
  | "manyToMany"

/**
 * Return true if the relationship is nullable
 */
export type IsNullableRelation<T> = T extends () => IDmlEntity<any, any> | null
  ? true
  : false

/**
 * The meta-data returned by the property parse method.
 * Extends the shared SchemaPropertyMetadata with DML-specific fields.
 */
export type PropertyMetadata = SchemaPropertyMetadata & {
  dataType: {
    name: KnownDataTypes
    options?: Record<string, any>
  }
  indexes: {
    name?: string
    type: "index" | "unique"
  }[]
  relationships: RelationshipMetadata[]
  primaryKey?: boolean
}

/**
 * Definition of a property type. It should have a parse
 * method to get the metadata and a type-only property
 * to get its static type
 */
export type PropertyType<T> = {
  $dataType: T
  parse(fieldName: string): PropertyMetadata
}

/**
 * Options accepted by all the relationships
 */
export type RelationshipOptions = {
  /**
   * The name of the relationship as defined in the other
   * data model. This is only required by the `belongsTo` and `manyToMany`
   * relationship method.
   */
  mappedBy?: string
} & Record<string, any>

/**
 * The meta-data returned by the relationship parse
 * method
 */
export type RelationshipMetadata = {
  name: string
  type: RelationshipTypes
  entity: unknown
  nullable?: boolean
  mappedBy?: string
  searchable: boolean
  options: Record<string, any>
}

/**
 * Definition of a relationship type. It should have a parse
 * method to get the metadata and a type-only property
 * to get its static type
 */
export type RelationshipType<T> = {
  $dataType: T
  type: RelationshipTypes
  parse(relationshipName: string): RelationshipMetadata
}

/**
 * A type-only representation of a MikroORM entity. Since we generate
 * entities on the fly, we need a way to represent a type-safe
 * constructor and its instance properties.
 */
export interface EntityConstructor<Props> extends Function {
  new (): Props
}

/**
 * From a IDmlEntity, infer the foreign keys name and type for
 * "belongsTo" relation meaning "hasOne" and "ManyToOne"
 */
export type InferForeignKeys<Schema extends DMLSchema> = {
  [K in keyof Schema as Schema[K] extends { $foreignKey: true }
    ? Schema[K] extends { $foreignKeyName: `${infer FkName}` }
      ? `${FkName & string}`
      : `${K & string}_id`
    : never]: Schema[K] extends { $foreignKey: true }
    ? null extends Schema[K]["$dataType"]
      ? string | null
      : string
    : never
}

/**
 * Infer fields for a belongsTo relationship
 */
export type InferBelongsToFields<Relation> = Relation extends () => IDmlEntity<
  infer R,
  any
>
  ? InferSchemaFields<R>
  : Relation extends () => IDmlEntity<infer R, any> | null
  ? InferSchemaFields<R> | null
  : never

/**
 * Infer fields for a hasOne relationship
 */
export type InferHasOneFields<Relation> = InferBelongsToFields<Relation>

/**
 * Infer fields for hasMany relationship
 */
export type InferHasManyFields<Relation> = Relation extends () => IDmlEntity<
  infer R,
  any
>
  ? InferSchemaFields<R>[]
  : never

/**
 * Infer fields for manyToMany relationship
 */
export type InferManyToManyFields<Relation> = InferHasManyFields<Relation>

/**
 * Infers the types of the schema fields from the DML entity
 */
export type InferSchemaFields<Schema extends DMLSchema> = Prettify<
  {
    [K in keyof Schema]: Schema[K] extends RelationshipType<any>
      ? Schema[K]["type"] extends "belongsTo"
        ? InferBelongsToFields<Schema[K]["$dataType"]>
        : Schema[K]["type"] extends "hasOne" | "hasOneWithFK"
        ? InferHasOneFields<Schema[K]["$dataType"]>
        : Schema[K]["type"] extends "hasMany"
        ? InferHasManyFields<Schema[K]["$dataType"]>
        : Schema[K]["type"] extends "manyToMany"
        ? InferManyToManyFields<Schema[K]["$dataType"]>
        : never
      : Schema[K]["$dataType"]
  } & InferForeignKeys<Schema>
>

/**
 * Infers the types of the schema fields from the DML entity
 * for module services
 */
export type InferSchemaFieldsForModuleServices<Schema extends DMLSchema> =
  Prettify<
    {
      [K in keyof Schema]: Schema[K] extends RelationshipType<any>
        ? Schema[K]["type"] extends "belongsTo"
          ? string
          : Schema[K]["type"] extends "hasOne" | "hasOneWithFK"
          ? string
          : Schema[K]["type"] extends "hasMany"
          ? string[]
          : Schema[K]["type"] extends "manyToMany"
          ? string[]
          : never
        : Schema[K]["$dataType"]
    } & InferForeignKeys<Schema>
  >

/**
 * Infers the schema properties without the relationships
 */
export type InferSchemaProperties<Schema extends DMLSchema> = Prettify<
  {
    [K in keyof Schema as Schema[K] extends { type: infer Type }
      ? Type extends RelationshipTypes
        ? never
        : K
      : K]: Schema[K]["$dataType"]
  } & InferForeignKeys<Schema>
>

/**
 * Extracts names of relationships from a schema
 */
export type ExtractEntityRelations<
  Schema extends Record<string, any>,
  OfType extends RelationshipTypes
> = {
  [K in keyof Schema & string]: Schema[K] extends RelationshipType<any>
    ? Schema[K] extends { type: OfType }
      ? K
      : never
    : never
}[keyof Schema & string][]

/**
 * Helper to infer the schema type of a DmlEntity
 */
export type Infer<T> = T extends IDmlEntity<infer Schema, any>
  ? EntityConstructor<InferSchemaFields<Schema>>
  : never

/**
 * Infers the schema fields for a DML entity as used by module services,
 * where relationships resolve to string IDs instead of full entity types.
 */
export type InferEntityForModuleService<T> = T extends IDmlEntity<
  infer Schema,
  any
>
  ? InferSchemaFieldsForModuleServices<Schema>
  : never

/**
 * The actions to cascade from a given entity to its
 * relationship.
 */
export type EntityCascades<DeletableRelationships, DetachableRelationships> = {
  /**
   * The related models to delete when a record of this data model
   * is deleted.
   */
  delete?: DeletableRelationships
  detach?: DetachableRelationships
}

/**
 * Helper to infer the instance type of a IDmlEntity once converted as an Entity
 */
export type InferTypeOf<T extends IDmlEntity<any, any>> = InstanceType<Infer<T>>

/**
 * Used in the module sdk internal service to infer propert entity typings from DML
 */
export type InferEntityType<T> = T extends IDmlEntity<any, any>
  ? InferTypeOf<T>
  : T

/**
 * Infer all indexable properties from a DML entity including inferred foreign keys and excluding relationship
 */
export type InferIndexableProperties<Schema extends DMLSchema> =
  keyof InferSchemaProperties<Schema>

/**
 * Returns a list of columns that could be mentioned
 * within the checks
 */
export type InferCheckConstraintsProperties<Schema extends DMLSchema> = {
  [K in keyof InferSchemaProperties<Schema>]: string
}

/**
 * Options supported when defining a PostgreSQL check
 */
export type CheckConstraint<Schema extends DMLSchema> =
  | ((columns: InferCheckConstraintsProperties<Schema>) => string)
  | {
      name?: string
      expression?:
        | string
        | ((columns: InferCheckConstraintsProperties<Schema>) => string)
      property?: string
    }

export type EntityIndex<
  Schema extends DMLSchema = DMLSchema,
  Where = string
> = {
  /**
   * The name of the index. If not provided,
   * Medusa generates the name.
   */
  name?: string
  /**
   * When enabled, a unique index is created on the specified
   * properties.
   */
  unique?: boolean
  /**
   * The list of properties to create the index on.
   */
  on: InferIndexableProperties<Schema>[]
  /**
   * Conditions to restrict which records are indexed.
   *
   * Medusa scopes indexes to `deleted_at IS NULL` by default. Set this to `null`
   * to opt out of that scope and create a non-partial index, which is required
   * for indexes that back a foreign key with a cascading rule.
   */
  where?: Where | null

  /**
   * The type of the index. (e.g: GIN)
   */
  type?: string
}

/**
 * A primitive value accepted in a DML query condition.
 */
export type SimpleQueryValue = string | number | boolean | null

/**
 * A "not equal" query operator wrapping a simple value.
 */
export type NeQueryValue = { $ne: SimpleQueryValue }

/**
 * A value accepted in a DML query condition, either a primitive or a "not equal" operator.
 */
export type QueryValue = SimpleQueryValue | NeQueryValue

/**
 * A condition object used to filter DML entity records by their schema fields.
 */
export type QueryCondition<T extends DMLSchema = DMLSchema> = {
  [K in keyof IDmlEntity<T, any>["schema"]]?: T[K] extends object
    ? QueryValue
    : QueryCondition<T>
}
