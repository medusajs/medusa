import { RelationshipMetadata } from "@zjedene-medusa/types"
import { camelToSnakeCase } from "../../../common/camel-to-snake-case"

/**
 * Returns the foreign key name for a relationship
 */
export function getForeignKey(relationship: RelationshipMetadata) {
  return (
    relationship.options.foreignKeyName ??
    camelToSnakeCase(`${relationship.name}Id`)
  )
}
