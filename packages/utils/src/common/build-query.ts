// Those utils are used in a typeorm context and we can't be sure that they can be used elsewhere

import { objectFromStringPath } from "./object-from-string-path"


type Order = {
  [key: string]: "ASC" | "DESC" | Order
}

type Selects = {
  [key: string]: boolean | Selects
}

type Relations = {
  [key: string]: boolean | Relations
}

export function buildSelects(selectCollection: string[]): Selects {
  return buildRelationsOrSelect(selectCollection)
}

export function buildRelations(relationCollection: string[]): Relations {
  return buildRelationsOrSelect(relationCollection)
}

function buildRelationsOrSelect(collection: string[]): Selects | Relations {
  return objectFromStringPath(collection)
}

/**
 * Convert an order of dot string into a nested object
 * @example
 * input: { id: "ASC", "items.title": "ASC", "items.variant.title": "ASC" }
 * output: {
 *   "id": "ASC",
 *   "items": {
 *     "id": "ASC",
 *     "variant": {
 *        "title": "ASC"
 *     }
 *   },
 * }
 * @param orderBy
 */
export function buildOrder<T>(orderBy: { [k: string]: "ASC" | "DESC" }): Order {
  const output: Order = {}

  const orderKeys = Object.keys(orderBy)

  for (const order of orderKeys) {
    if (order.indexOf(".") > -1) {
      const nestedOrder = order.split(".")

      let parent = output

      while (nestedOrder.length > 1) {
        const nestedRelation = nestedOrder.shift() as string
        parent = (parent[nestedRelation] as Order) ??= {}
      }

      parent[nestedOrder[0]] = orderBy[order]

      continue
    }

    output[order] = orderBy[order]
  }

  return output
}
