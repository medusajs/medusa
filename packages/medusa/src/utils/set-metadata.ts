import { MedusaError } from "medusa-core-utils/dist"

/**
* Dedicated method to set metadata.
* @param obj - the entity to apply metadata to.
* @param metadata - the metadata to set
* @return resolves to the updated result.
*/
export function setMetadata_(
  obj: { metadata: Record<string, unknown> },
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
    newData[key] = value
  }

  return {
    ...existing,
    ...newData,
  }
}