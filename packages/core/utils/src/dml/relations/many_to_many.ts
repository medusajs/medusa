import { BaseRelationship } from "./base"
import { RelationshipMetadata } from "../types"

export class ManyToMany<T> extends BaseRelationship<T> {
  protected relationshipType: RelationshipMetadata["type"] = "manyToMany"
}
