import { difference } from "lodash"
import { Idable } from "../../../types/shared"

/**
 * Given a list of ids, we return the entities corresponding to those ids
 * The `source` list is only used when adding items and only contains entities for at least the difference between `ids` and `items`
 * e.g: items: [entityA, entityB] --- ids: [a,b,c] --- source: [entityC, entityD, ...]
 */

export const mapIdsToItems = <T extends Idable>(
  items: T[] = [],
  ids: string[] = [],
  source: T[] = []
) => {
  const itemIds = items.map((item) => item?.id)
  /* we need to add an entity to the selectedItems list */
  if (items.length < ids.length) {
    const added = difference(ids, itemIds)
    const newItems = added.map((id) => source.find((s) => s.id === id)) as T[]
    return items.concat(newItems)
  } else if (items.length > ids.length) {
    /* we need to remove an entity from the selectedItems */
    const removed = difference(itemIds, ids)
    const newItems = items.slice()
    removed.forEach((id) => {
      const index = newItems.findIndex((item) => item?.id === id)
      newItems.splice(index, 1)
    })
    return newItems
  }
  return items
}
