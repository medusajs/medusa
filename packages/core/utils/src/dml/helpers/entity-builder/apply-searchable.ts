import {
  EntityConstructor,
  PropertyMetadata,
  RelationshipMetadata,
} from "@zjedene-medusa/types"
import { Searchable } from "../../../dal"

/**
 * Apply the searchable decorator to the property marked as searchable to enable the free text search
 */
export function applySearchable(
  MikroORMEntity: EntityConstructor<any>,
  fieldOrRelationship: PropertyMetadata | RelationshipMetadata
) {
  let propertyName: string
  let isSearchable: boolean

  if ("fieldName" in fieldOrRelationship) {
    propertyName = fieldOrRelationship.fieldName
    isSearchable = !!fieldOrRelationship.dataType.options?.searchable
  } else {
    propertyName = fieldOrRelationship.name
    isSearchable = fieldOrRelationship.searchable
  }

  if (!isSearchable) {
    return
  }

  Searchable()(MikroORMEntity.prototype, propertyName)
}
