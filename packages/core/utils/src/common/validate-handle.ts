/**
 * Helper method to validate entity "handle" to be URL
 * friendly.
 */
export const isValidHandle = (value: string): boolean => {
  return /^(?:%[0-9A-Fa-f]{2}|[a-z0-9]+)(?:-[a-z0-9]+|(?:-%[0-9A-Fa-f]{2})*(?:%[0-9A-Fa-f]{2})*(?:-[a-z0-9])?)+(?:[a-z0-9])*$/.test(value)
}
