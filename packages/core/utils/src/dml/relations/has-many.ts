import { BaseRelationship } from "./base"
import { RelationshipMetadata } from "../types"

/**
 * HasMany relationship defines a relationship between two entities
 * where the owner of the relationship has many instance of the
 * related entity.
 *
 * For example:
 *
 * - A user HasMany books
 * - A user HasMany addresses
 */
export class HasMany<T> extends BaseRelationship<T> {
  protected relationshipType: RelationshipMetadata["type"] = "hasMany"
}
