import { MedusaError } from "medusa-core-utils/dist"

/**
 * Dedicated method to set metadata.
 * @param obj - the entity to apply metadata to.
 * @param metadata - the metadata to set
 * @return resolves to the updated result.
 */
export function setMetadata(
  obj: { metadata: Record<string, unknown> | null },
  metadata: Record<string, unknown>
): Record<string, unknown> {
  const existing = obj.metadata || {}
  const newData = {}

  for (const [key, value] of Object.entries(metadata)) {
    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    /**
     * We reserve the empty string as a way to delete a key.
     * If the value is an empty string, we don't
     * set it, and if it exists in the existing metadata, we
     * unset the field.
     */
    if (value === "") {
      if (key in existing) {
        delete existing[key]
      }

      continue
    }

    newData[key] = value
  }

  return {
    ...existing,
    ...newData,
  }
}
