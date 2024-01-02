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
export function objectFromStringPath(
  collection: string[]
): Record<string, any> {
  collection = collection.sort()
  const output: Record<string, any> = {}

  for (const relation of collection) {
    if (!relation) {
      continue
    }
    if (relation.indexOf(".") > -1) {
      const nestedRelations = relation.split(".")

      let parent = output

      while (nestedRelations.length > 1) {
        const nestedRelation = nestedRelations.shift() as string
        parent = parent[nestedRelation] =
          parent[nestedRelation] !== true &&
          typeof parent[nestedRelation] === "object"
            ? parent[nestedRelation]
            : {}
      }

      parent[nestedRelations[0]] = true

      continue
    }

    output[relation] = output[relation] ?? true
  }

  return output
}
