import { SchemaPropertyMetadata, SchemaPropertyType } from "@medusajs/types"

/**
 * Shared parse/type plumbing for schema properties used by DML, the search
 * DSL, and any future domain language that describes typed fields. Fluent
 * modifiers (`default()`, `nullable()`, ...) belong to the domains that give
 * them meaning — a search field has no default value, so the base must not
 * offer one.
 */
export abstract class BaseSchemaProperty<T> implements SchemaPropertyType<T> {
  /**
   * The runtime dataType for the schema. It is not the same as
   * the "$dataType".
   */
  protected abstract dataType: SchemaPropertyMetadata<T>["dataType"]

  /**
   * A type-only property to infer the JavaScript data-type
   * of the schema property
   */
  declare $dataType: T

  /**
   * Returns the serialized metadata
   */
  parse(fieldName: string): SchemaPropertyMetadata<T> {
    return {
      fieldName,
      dataType: this.dataType,
      nullable: false,
      computed: false,
    }
  }
}
