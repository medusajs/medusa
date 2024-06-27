import { RelationshipType } from "@medusajs/types"

const IsNullableModifier = Symbol.for("isNullableModifier")

/**
 * Nullable modifier marks a schema node as nullable
 */
export class NullableModifier<T, Relation extends RelationshipType<T>>
  implements RelationshipType<T | null>
{
  [IsNullableModifier]: true = true

  static isNullableModifier<T>(
    modifier: any
  ): modifier is NullableModifier<T, any> {
    return !!modifier?.[IsNullableModifier]
  }

  declare type: RelationshipType<T>["type"]

  /**
   * A type-only property to infer the JavScript data-type
   * of the schema property
   */
  declare $dataType: T | null

  /**
   * The parent schema on which the nullable modifier is
   * applied
   */
  #relation: Relation

  constructor(relation: Relation) {
    this.#relation = relation
    this.type = relation.type
  }

  /**
   * Returns the serialized metadata
   */
  parse(fieldName: string) {
    const relation = this.#relation.parse(fieldName)
    relation.nullable = true
    return relation
  }
}
