/**
 * Providers only have an ID to identify them. This function formats the ID
 * into a human-readable string.
 * @param id - The ID of the provider
 * @returns A formatted string
 */
export const formatProvider = (id: string) => {
  return id
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")
}
