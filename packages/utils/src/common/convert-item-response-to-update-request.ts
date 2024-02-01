import { isObject } from "../common/is-object"

interface ItemRecord extends Record<string, any> {
  id: string
}

export function convertItemResponseToUpdateRequest(
  item: ItemRecord,
  selects: string[],
  relations: string[],
  fromManyRelationships: boolean = false
): ItemRecord {
  const newItem: ItemRecord = {
    id: item.id,
  }

  // If item is a child of a many relationship, we just need to pass in the id of the item
  if (fromManyRelationships) {
    return newItem
  }

  for (const [key, value] of Object.entries(item)) {
    if (relations.includes(key)) {
      const relation = item[key]

      // If the relationship is an object, its either a one to one or many to one relationship
      // We typically don't update the parent from the child relationship, we can skip this for now.
      // This can be focused on solely for one to one relationships
      if (isObject(relation)) {
        // If "id" is the only one in the object, underscorize the relation. This is assuming that
        // the relationship itself was changed to another item and now we need to revert it to the old item.
        if (Object.keys(relation).length === 1 && "id" in relation) {
          newItem[`${key}_id`] = relation.id
        }

        // If attributes of the relation have been updated, we can assume that this
        // was an update operation on the relation. We revert what was updated.
        if (Object.keys(relation).length > 1) {
          // The ID can be figured out from the relationship, we can delete the ID here
          if ("id" in relation) {
            delete relation.id
          }

          // we just need the selects for the relation, filter it out and remove the parent scope
          const filteredSelects = selects
            .filter((s) => s.startsWith(key) && !s.includes("id"))
            .map(shiftFirstPath)

          // Add the filtered selects to the sanitized object
          for (const filteredSelect of filteredSelects) {
            newItem[key] = newItem[key] || {}
            newItem[key][filteredSelect] = relation[filteredSelect]
          }
        }

        continue
      }

      // If the relation is an array, we can expect this to be a one to many or many to many
      // relationships. Recursively call the function until all relations are converted
      if (Array.isArray(relation)) {
        const newRelationsArray: ItemRecord[] = []

        for (const rel of relation) {
          // Scope selects and relations to ones that are relevant to the current relation
          const filteredRelations = relations
            .filter((r) => r.startsWith(key))
            .map(shiftFirstPath)

          const filteredSelects = selects
            .filter((s) => s.startsWith(key))
            .map(shiftFirstPath)

          newRelationsArray.push(
            convertItemResponseToUpdateRequest(
              rel,
              filteredSelects,
              filteredRelations,
              true
            )
          )
        }

        newItem[key] = newRelationsArray
      }
    }

    // if the key exists in the selects, we add them to the new sanitized array.
    // sanitisation is done because MikroORM adds relationship attributes and other default attributes
    // which we do not want to add to the update request
    if (selects.includes(key) && !fromManyRelationships) {
      newItem[key] = value
    }
  }

  return newItem
}

function shiftFirstPath(select) {
  const selectArray = select.split(".")
  selectArray.shift()

  return selectArray.join(".")
}
