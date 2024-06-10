import { BaseRelationship } from "./base"
import { RelationshipMetadata } from "../types"

export class HasOne<T> extends BaseRelationship<T> {
  protected relationshipType: RelationshipMetadata["type"] = "hasOne"
}
