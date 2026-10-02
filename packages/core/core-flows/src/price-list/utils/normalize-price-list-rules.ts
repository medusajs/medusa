/**
 * Price list rules are stored as an attribute/value pair and matched verbatim
 * against the flattened pricing context. The context exposes the customer's
 * groups under `customer.groups.id`, so a rule stored as `customer_group_id`
 * can never match and the price list is silently skipped.
 *
 * `customer_group_id` was the attribute used before the pricing context moved
 * to the nested customer shape, and existing rows were rewritten by the
 * pricing module's `Migration20241212190401`. Inbound rules were never
 * normalized though, so callers still sending the old attribute keep creating
 * rules that cannot match.
 */
const LEGACY_RULE_ATTRIBUTES = {
  customer_group_id: "customer.groups.id",
}

/**
 * Rewrites the legacy attributes of a price list's rules to the attributes the
 * pricing context is flattened into. Price list data without rules, or with
 * rules that only use current attributes, is returned untouched.
 */
export function normalizePriceListRules<
  T extends { rules?: Record<string, string[]> | null }
>(priceListData: T): T {
  const { rules } = priceListData

  if (!rules) {
    return priceListData
  }

  const normalizedRules = Object.entries(rules).reduce(
    (acc, [attribute, value]) => {
      const normalizedAttribute = LEGACY_RULE_ATTRIBUTES[attribute] ?? attribute

      // A caller that sends both the legacy attribute and the one it maps to
      // keeps the value it sent for the latter.
      if (normalizedAttribute !== attribute && normalizedAttribute in rules) {
        return acc
      }

      acc[normalizedAttribute] = value
      return acc
    },
    {} as Record<string, string[]>
  )

  return { ...priceListData, rules: normalizedRules }
}
