/**
 * Recursively converts BigNumber instances to plain numbers, while preserving
 * Dates and object/array structure.
 *
 * Retrieving or creating orders/carts computes totals, so numeric fields come
 * back as BigNumber instances rather than primitives. Use this in test
 * assertions (e.g. `expect(normalizeBigNumbers(order)).toEqual(...)`) to compare
 * against plain-number expectations. Dates are left intact so matchers like
 * `expect.any(Date)` keep working.
 */
export function normalizeBigNumbers(value: any): any {
  if (Array.isArray(value)) {
    return value.map(normalizeBigNumbers)
  }

  if (value && typeof value === "object" && !(value instanceof Date)) {
    // Duck-type the framework BigNumber (has `numeric_` and `raw_`).
    if ("numeric_" in value && "raw_" in value) {
      return Number(value)
    }

    return Object.fromEntries(
      Object.keys(value).map((key) => [key, normalizeBigNumbers(value[key])])
    )
  }

  return value
}
