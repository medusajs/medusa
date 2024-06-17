import { BaseRelationship } from "./base"
import { RelationshipTypes } from "../types"
import { NullableModifier } from "./nullable"

export class BelongsTo<T> extends BaseRelationship<T> {
  type = "belongsTo" as const

  /**
   * Apply nullable modifier on the schema
   */
  nullable() {
    return new NullableModifier<T, BelongsTo<T>>(this)
  }
}
