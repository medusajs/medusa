import { kebabCase } from "./to-kebab-case"

/**
 * Helper method to validate entity "handle" to be URL
 * friendly.
 */
export const isValidHandle = (value: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}
