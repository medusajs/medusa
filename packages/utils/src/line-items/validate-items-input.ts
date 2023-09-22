import { ProductVariantDTO } from "@medusajs/types"
import { MedusaError } from "medusa-core-utils"

/**
 * Validate that data passed to create line items has valid variant ids
 *
 * @param input - input for creating line items
 * @param variants - variants queried based on variant ids from the input
 */
export function validateItemsInput(
  input: Partial<{ variant_id?: string }>[],
  variants: ProductVariantDTO[]
) {
  const idsMap = new Map(variants.map((v) => [v.id, true]))

  for (let item of input) {
    if (!item.variant_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "variant_id must be passed when creating a line item"
      )
    }

    if (!idsMap.has(item.variant_id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `variant with id: ${item.variant_id} not found`
      )
    }
  }
}
