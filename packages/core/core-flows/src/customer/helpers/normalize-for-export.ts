/**
 * Builds the export record for a single customer.
 *
 * The record is composed of the customer's own PII (and any related data
 * selected through Query, such as addresses, groups, orders, carts, and
 * account holders) merged with the PII slices contributed by custom modules
 * through the `customerDataExport` hook (e.g. reviews, warranty claims,
 * feedback, affiliate data).
 *
 * @param customer - The raw customer record returned by Query.
 * @param additionalData - The PII slices contributed for this customer by the
 * `customerDataExport` hook, keyed by an arbitrary section name.
 * @returns A plain object representing the customer's full data footprint.
 */
export const normalizeCustomerForExport = (
  customer: Record<string, any>,
  additionalData?: Record<string, unknown>
): Record<string, unknown> => {
  const record: Record<string, unknown> = { ...customer }

  if (additionalData && typeof additionalData === "object") {
    for (const [key, value] of Object.entries(additionalData)) {
      record[key] = value
    }
  }

  // Round-trip through JSON to drop `undefined` values so they don't create
  // noisy, empty columns/keys in the export.
  return JSON.parse(JSON.stringify(record))
}
