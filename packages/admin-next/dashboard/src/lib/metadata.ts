export type MetadataField = {
  key: string
  value: string
  /**
   * Is the field provided as initial data
   */
  isInitial?: boolean
  /**
   * Whether the row was deleted
   */
  isDeleted?: boolean
  /**
   * True for initial values that are not primitives
   */
  isIgnored?: boolean
}

const isPrimitive = (value: any): boolean => {
  return (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  )
}

/**
 * Convert metadata property to an array of form filed values.
 */
export const metadataToFormValues = (
  metadata?: Record<string, any> | null
): MetadataField[] => {
  const data: MetadataField[] = []

  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      data.push({
        key,
        value: value as string,
        isInitial: true,
        isIgnored: !isPrimitive(value),
        isDeleted: false,
      })
    })
  }

  // DEFAULT field for adding a new metadata record
  // it's added here so it's registered as a default value
  data.push({
    key: "",
    value: "",
    isInitial: false,
    isIgnored: false,
    isDeleted: false,
  })

  return data
}

/**
 * Convert a form fields array to a metadata object
 */
export const formValuesToMetadata = (
  data: MetadataField[]
): Record<string, unknown> => {
  return data.reduce((acc, { key, value, isDeleted, isIgnored, isInitial }) => {
    if (isIgnored) {
      acc[key] = value
      return acc
    }

    if (isDeleted && isInitial) {
      acc[key] = ""
      return acc
    }

    if (key) {
      acc[key] = value // TODO: since these are primitives should we parse strings to their primitive format e.g. "123" -> 123 , "true" -> true
    }

    return acc
  }, {} as Record<string, unknown>)
}
