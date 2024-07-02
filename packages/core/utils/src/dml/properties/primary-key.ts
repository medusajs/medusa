import { PropertyType } from "@medusajs/types"

const IsPrimaryKeyModifier = Symbol.for("isPrimaryKeyModifier")
/**
 * PrimaryKey modifier marks a schema node as primaryKey
 */
export class PrimaryKeyModifier<T, Schema extends PropertyType<T>>
  implements PropertyType<T>
{
  [IsPrimaryKeyModifier]: true = true

  static isPrimaryKeyModifier(obj: any): obj is PrimaryKeyModifier<any, any> {
    return !!obj?.[IsPrimaryKeyModifier]
  }
  /**
   * A type-only property to infer the JavScript data-type
   * of the schema property
   */
  declare $dataType: T

  /**
   * The parent schema on which the primaryKey modifier is
   * applied
   */
  #schema: Schema

  constructor(schema: Schema) {
    this.#schema = schema
  }

  /**
   * Returns the serialized metadata
   */
  parse(fieldName: string) {
    const schema = this.#schema.parse(fieldName)
    schema.primaryKey = true
    return schema
  }
}
