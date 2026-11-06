import { BaseRelationship } from "./base"
import { RelationNullableModifier } from "./nullable"

export class BelongsTo<
  T,
  const OptionalForeignKeyName extends string | undefined = undefined,
> extends BaseRelationship<T> {
  type = "belongsTo" as const
  declare $foreignKey: true
  declare $foreignKeyName: OptionalForeignKeyName

  static isBelongsTo<T>(relationship: any): relationship is BelongsTo<T, any> {
    return relationship?.type === "belongsTo"
  }

  /**
   * Apply nullable modifier on the schema
   */
  nullable() {
    return new RelationNullableModifier<
      T,
      BelongsTo<T, OptionalForeignKeyName>,
      true
    >(this)
  }
}
