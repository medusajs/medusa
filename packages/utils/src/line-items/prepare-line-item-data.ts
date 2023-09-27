import { ProductVariantDTO } from "@medusajs/types"
import { MedusaError } from "medusa-core-utils"

import pick from "lodash/pick"

const VARIANT_PROPERTIES = [
  "title",
  "metadata",
  "product_id",
  "product.id",
  "product.title",
  "product.discountable",
  "product.is_giftcard",
]

export type LineItemCreateData = {
  variant_id: string
  title: string
  product_id: string
  product: {
    id: string
    title: string
    thumbnail: string | null
    discountable: boolean
    is_giftcard: boolean
  }
  metadata?: Record<string, unknown>

  quantity: number
  unit_price?: number
}

/**
 * Generate the expected shaped data to generate a line item from the variant data.
 *
 * @param variantData
 * @param quantity
 * @param unit_price
 */
export function prepareLineItemData(
  variantData: Partial<ProductVariantDTO>,
  quantity: number,
  unit_price?: number
): LineItemCreateData {
  if (!variantData.product) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "variant.product is required to generate line item data"
    )
  }

  return {
    ...pick(variantData, VARIANT_PROPERTIES),
    variant_id: variantData.id!,
    quantity,
    unit_price,
  } as LineItemCreateData
}
