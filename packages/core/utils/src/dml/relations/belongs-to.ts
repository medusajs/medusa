import { BaseRelationship } from "./base"
import { RelationshipMetadata } from "../types"
import { NullableModifier } from "../modifiers/nullable"

export class BelongsTo<T> extends BaseRelationship<T> {
  protected relationshipType: RelationshipMetadata["type"] = "belongsTo"

  /**
   * Apply nullable modifier on the schema
   */
  nullable() {
    return new NullableModifier<T, BelongsTo<T>>(this)
  }
}
