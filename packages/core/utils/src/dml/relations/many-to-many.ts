import { BaseRelationship } from "./base"
import { RelationshipMetadata } from "../types"

/**
 * ManyToMany relationship defines a relationship between two entities
 * where the owner of the relationship has many instance of the
 * related entity via a pivot table.
 *
 * For example:
 *
 * - A user has many teams. But a team has many users as well. So this
 *   relationship requires a pivot table to establish a many to many
 *   relationship between two entities
 */
export class ManyToMany<T> extends BaseRelationship<T> {
  protected relationshipType: RelationshipMetadata["type"] = "manyToMany"
}
