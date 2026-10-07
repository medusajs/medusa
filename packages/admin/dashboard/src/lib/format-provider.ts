/**
 * Providers only have an ID to identify them. This function formats the ID
 * into a human-readable string.
 *
 * Format example: pp_stripe-blik_dkk
 *
 * @param id - The ID of the provider
 * @returns A formatted string
 */
export const formatProvider = (id: string) => {
  const [_, name, ...rest] = id.split("_")

  if (!name) {
    return id
  }

  const formattedName = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")

  if (!rest.length) {
    return formattedName
  }

  // A single short part (eg. a currency code) reads better uppercased, while longer
  // identifiers (eg. a payment account ID like acct_123) are kept as they are.
  const type = rest.length === 1 ? rest[0].toUpperCase() : rest.join("_")

  return `${formattedName} (${type})`
}
