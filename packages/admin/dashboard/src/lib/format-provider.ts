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
  const [_, name, type] = id.split("_")
  return (
    name
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ") + (type ? ` (${type.toUpperCase()})` : "")
  )
}
