import { EntityConstructor, PropertyMetadata } from "@medusajs/types"
import { Searchable } from "../../../dal"

/**
 * Apply the searchable decorator to the property marked as searchable to enable the free text search
 */
export function applySearchable(
  MikroORMEntity: EntityConstructor<any>,
  field: PropertyMetadata
) {
  if (!field.dataType.options?.searchable) {
    return
  }

  Searchable()(MikroORMEntity.prototype, field.fieldName)
}
