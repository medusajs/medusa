import { BaseRelationship } from "./base"

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
  type = "manyToMany" as const

  static isManyToMany<T>(relationship: any): relationship is ManyToMany<T> {
    return relationship?.type === "manyToMany"
  }
}
