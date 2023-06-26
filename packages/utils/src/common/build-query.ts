// Those utils are used in a typeorm context and we can't be sure that they can be used elsewhere

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

/**
 * Convert a collection of dot string into a nested object
 * @example
 * input: [
 *    order,
 *    order.items,
 *    order.swaps,
 *    order.swaps.additional_items,
 *    order.discounts,
 *    order.discounts.rule,
 *    order.claims,
 *    order.claims.additional_items,
 *    additional_items,
 *    additional_items.variant,
 *    return_order,
 *    return_order.items,
 *    return_order.shipping_method,
 *    return_order.shipping_method.tax_lines
 * ]
 * output: {
 *   "order": {
 *     "items": true,
 *     "swaps": {
 *       "additional_items": true
 *     },
 *     "discounts": {
 *       "rule": true
 *     },
 *     "claims": {
 *       "additional_items": true
 *     }
 *   },
 *   "additional_items": {
 *     "variant": true
 *   },
 *   "return_order": {
 *     "items": true,
 *     "shipping_method": {
 *       "tax_lines": true
 *     }
 *   }
 * }
 * @param collection
 */
function buildRelationsOrSelect(collection: string[]): Selects | Relations {
  const output: Selects | Relations = {}

  for (const relation of collection) {
    if (relation.indexOf(".") > -1) {
      const nestedRelations = relation.split(".")

      let parent = output

      while (nestedRelations.length > 1) {
        const nestedRelation = nestedRelations.shift() as string
        parent = parent[nestedRelation] = (
          parent[nestedRelation] !== true &&
          typeof parent[nestedRelation] === "object"
            ? parent[nestedRelation]
            : {}
        ) as Selects | Relations
      }

      parent[nestedRelations[0]] = true

      continue
    }

    output[relation] = output[relation] ?? true
  }

  return output
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
