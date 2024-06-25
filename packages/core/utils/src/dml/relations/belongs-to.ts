import { BaseRelationship } from "./base"
import { NullableModifier } from "./nullable"

export class BelongsTo<T> extends BaseRelationship<T> {
  type = "belongsTo" as const

  static isBelongsTo<T>(relationship: any): relationship is BelongsTo<T> {
    return !!relationship && relationship.type === "belongsTo"
  }

  /**
   * Apply nullable modifier on the schema
   */
  nullable() {
    return new NullableModifier<T, BelongsTo<T>>(this)
  }
}
