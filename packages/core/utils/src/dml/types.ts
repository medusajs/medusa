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
  | "any"

/**
 * The meta-data returned by the schema parse method
 */
export type SchemaMetaData = {
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
  relationships: {
    name: string
    type: "hasOne" | "hasMany" | "manyToMany"
    options?: Record<string, any>
  }[]
}

/**
 * Definition of a schema type. It should have a parse
 * method to get the metadata and a type-only property
 * to get its static type
 */
export type SchemaType<T> = {
  $dataType: T
  parse(fieldName: string): SchemaMetaData
}
