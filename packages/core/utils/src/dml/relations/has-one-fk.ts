import { BaseRelationship } from "./base"
import { RelationNullableModifier } from "./nullable"

/**
 * HasOne relationship defines a relationship between two entities
 * where the owner of the relationship has exactly one instance
 * of the related entity.
 *
 * For example: A user HasOne profile
 *
 * You may use the "BelongsTo" relationship to define the inverse
 * of the "HasOne" relationship
 */
export class HasOneWithForeignKey<
  T,
  const OptionalForeignKeyName extends string | undefined = undefined,
> extends BaseRelationship<T> {
  type = "hasOneWithFK" as const
  declare $foreignKey: true
  declare $foreignKeyName: OptionalForeignKeyName

  static isHasOneWithForeignKey<T>(
    relationship: any
  ): relationship is HasOneWithForeignKey<T, any> {
    return relationship?.type === "hasOneWithFK"
  }

  /**
   * Apply nullable modifier on the schema
   */
  nullable() {
    return new RelationNullableModifier<
      T,
      HasOneWithForeignKey<T, OptionalForeignKeyName>,
      true
    >(this)
  }
}
