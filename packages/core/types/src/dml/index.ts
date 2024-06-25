export const IsDmlEntity = Symbol.for("isDmlEntity")

export interface IDmlEntity<
  Schema extends Record<string, PropertyType<any> | RelationshipType<any>>
> {
  [IsDmlEntity]: true
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
  | "dateTime"
  | "json"
  | "id"

/**
 * List of available relationships at DML level
 */
export type RelationshipTypes =
  | "hasOne"
  | "hasMany"
  | "belongsTo"
  | "manyToMany"

/**
 * The meta-data returned by the property parse method
 */
export type PropertyMetadata = {
  fieldName: string
  defaultValue?: any
  nullable: boolean
  searchable: boolean
  dataType: {
    name: KnownDataTypes
    options?: Record<string, any>
  }
  indexes: {
    name?: string
    type: "index" | "unique"
  }[]
  relationships: RelationshipMetadata[]
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
  nullable: boolean
  mappedBy?: string
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
 * From a IDmlEntity, infer the foreign keys name and type for belongsTo relation meaning hasOne and ManyToOne
 */
export type InferForeignKeys<T> = T extends IDmlEntity<infer Schema>
  ? {
      [K in keyof Schema as Schema[K] extends RelationshipType<any>
        ? Schema[K]["type"] extends "belongsTo"
          ? `${K & string}_id`
          : K
        : K]: Schema[K] extends RelationshipType<infer R>
        ? Schema[K]["type"] extends "belongsTo"
          ? string
          : Schema[K]
        : Schema[K]
    }
  : never

/**
 * Helper to infer the schema type of a DmlEntity
 */
export type Infer<T> = T extends IDmlEntity<infer Schema>
  ? EntityConstructor<
      {
        [K in keyof Schema]: Schema[K]["$dataType"] extends () => infer R
          ? Infer<R>
          : Schema[K]["$dataType"] extends (() => infer R) | null
          ? Infer<R> | null
          : Schema[K]["$dataType"]
      } & InferForeignKeys<T>
    >
  : never

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
 * The actions to cascade from a given entity to its
 * relationship.
 */
export type EntityCascades<Relationships> = {
  delete?: Relationships
}

/**
 * Helper to infer the instance type of a IDmlEntity once converted as an Entity
 */
export type InferTypeOf<T extends IDmlEntity<any>> = InstanceType<Infer<T>>

/**
 * Used in the module sdk internal service to infer propert entity typings from DML
 */
export type InferEntityType<T extends any> = T extends IDmlEntity<any>
  ? InferTypeOf<T>
  : T
