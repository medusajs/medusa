/**
 * The meta-data returned by a shared schema property parse method.
 * Domain-specific metadata (DML indexes, search facets, etc.) extends this.
 *
 * `TDataType` types `defaultValue` to match the property's `$dataType`.
 * Defaults to `any` so untyped call sites (compilers, helpers) keep working.
 *
 * @since 2.18.1
 */
export type SchemaPropertyMetadata<TDataType = any> = {
  fieldName: string
  defaultValue?: TDataType
  nullable: boolean
  computed: boolean
  dataType: {
    name: string
    options?: Record<string, any>
  }
}

/**
 * Definition of a schema property type. It should have a parse
 * method to get the metadata and a type-only property
 * to get its static type.
 *
 * @since 2.18.1
 */
export type SchemaPropertyType<T> = {
  $dataType: T
  parse(fieldName: string): SchemaPropertyMetadata<T>
}
