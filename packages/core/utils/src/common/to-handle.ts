import { kebabCase } from "./to-kebab-case"

/**
 * Helper method to create a to be URL friendly "handle" from
 * a string value.
 *
 * - Works by converting the value to lowercase
 * - Splits and remove accents from characters
 * - Removes all unallowed characters like a '"%$ and so on.
 */
export const toHandle = (value: string): string => {
  return kebabCase(
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  ).replace(/[^a-z0-9A-Z-_]/g, "")
}
