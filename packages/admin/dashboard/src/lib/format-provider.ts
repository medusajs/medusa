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
  if (id == null || id === "") {
    return ""
  }

  const parts = id.split("_")
  const name = parts[1]
  if (name == null || name === "") {
    return id
  }

  const type = parts[2]
  return (
    name
      .split("-")
      .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : ""))
      .filter(Boolean)
      .join(" ") + (type ? ` (${type.toUpperCase()})` : "")
  )
}
