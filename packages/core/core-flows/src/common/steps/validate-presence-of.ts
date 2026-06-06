import { isPresent, MedusaError } from "@zjedene-medusa/framework/utils"
import { createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * This step validates the presence of attributes on an object
 */
export const validatePresenceOfStep = createStep(
  "validate-presence-of",
  async function ({
    entity,
    fields,
  }: {
    entity: Record<any, unknown>
    fields: string[]
  }) {
    const invalid: string[] = []

    for (const field of fields) {
      if (!isPresent(entity[field])) {
        invalid.push(field)
      }
    }

    if (invalid.length) {
      const invalidFields = invalid.join(", ")

      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Field(s) are required to have value to continue - ${invalidFields}`
      )
    }
  }
)
