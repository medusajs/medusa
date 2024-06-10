import { BaseRelationship } from "./base"
import { RelationshipMetadata } from "../types"

export class HasMany<T> extends BaseRelationship<T> {
  protected relationshipType: RelationshipMetadata["type"] = "hasMany"
}
