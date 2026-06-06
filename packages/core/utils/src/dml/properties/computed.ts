import { PropertyType } from "@zjedene-medusa/types"

const IsComputedProperty = Symbol.for("isComputedProperty")
/**
 * Computed property marks a schema node as computed
 */
export class ComputedProperty<T, Schema extends PropertyType<T>>
  implements PropertyType<T | null>
{
  [IsComputedProperty]: true = true

  static isComputedProperty(obj: any): obj is ComputedProperty<any, any> {
    return !!obj?.[IsComputedProperty]
  }
  /**
   * A type-only property to infer the JavScript data-type
   * of the schema property
   */
  declare $dataType: T | null

  /**
   * The parent schema on which the computed property is
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
    schema.computed = true
    return schema
  }
}
