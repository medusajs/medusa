import { DmlEntity } from "./entity"

/**
 * The supported data types
 */
export type KnownDataTypes =
  | "string"
  | "boolean"
  | "enum"
  | "number"
  | "dateTime"
  | "json"

/**
 * The meta-data returned by the relationship parse
 * method
 */
export type RelationshipMetadata = {
  name: string
  type: "hasOne" | "hasMany" | "manyToMany"
  entity: unknown
  options: Record<string, any>
}

/**
 * The meta-data returned by the schema parse method
 */
export type SchemaMetadata = {
  nullable: boolean
  optional: boolean
  fieldName: string
  dataType: {
    name: KnownDataTypes
    options?: Record<string, any>
  }
  indexes: {
    name: string
    type: string
  }[]
  relationships: RelationshipMetadata[]
}

/**
 * Definition of a schema type. It should have a parse
 * method to get the metadata and a type-only property
 * to get its static type
 */
export type SchemaType<T> = {
  $dataType: T
  parse(fieldName: string): SchemaMetadata
}

/**
 * Definition of a relationship type. It should have a parse
 * method to get the metadata and a type-only property
 * to get its static type
 */
export type RelationshipType<T> = {
  $dataType: T
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
 * Helper to infer the schema type of a DmlEntity
 */
export type Infer<T> = T extends DmlEntity<infer Schema>
  ? EntityConstructor<{
      [K in keyof Schema]: Schema[K]["$dataType"] extends () => infer R
        ? Infer<R>
        : Schema[K]["$dataType"]
    }>
  : never
