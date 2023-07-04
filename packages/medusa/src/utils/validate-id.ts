/**
 * Confirms whether a given raw id is valid. Fails if the provided
 * id is null or undefined. The validate function takes an optional config
 * param, to support checking id prefix and length.
 * @param rawId - the id to validate.
 * @param config - optional config
 * @returns the rawId given that nothing failed
 */
import { MedusaError } from "medusa-core-utils/dist"

export function validateId(
  rawId: string,
  config: { prefix?: string; length?: number } = {}
): string {
  const { prefix, length } = config
  if (!rawId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Failed to validate id: ${rawId}`
    )
  }

  if (prefix || length) {
    const [pre, rand] = rawId.split("_")
    if (prefix && pre !== prefix) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The provided id: ${rawId} does not adhere to prefix constraint: ${prefix}`
      )
    }

    if (length && length !== rand.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The provided id: ${rawId} does not adhere to length constraint: ${length}`
      )
    }
  }

  return rawId
}
