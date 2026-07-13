import { isDefined } from "@medusajs/utils"

/**
 * Collects all defined values of `property` across items (flattens arrays).
 */
export function getNestedItems(items: any[], property: string): any[] {
  const result: unknown[] = []
  for (const item of items) {
    const allValues = item?.[property] ?? []
    const values = Array.isArray(allValues) ? allValues : [allValues]
    for (const value of values) {
      if (isDefined(value)) {
        result.push(value)
      }
    }
  }
  return result
}
