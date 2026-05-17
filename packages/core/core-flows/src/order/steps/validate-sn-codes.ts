import {
  IProductModuleService,
  ProductDTO,
  ProductVariantDTO,
} from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * An item to validate SN codes for.
 */
export type ValidateSnCodesItem = {
  /**
   * The ID of the product variant.
   */
  variant_id: string
  /**
   * The quantity of the item.
   */
  quantity: number
  /**
   * The SN codes to validate.
   */
  sn_codes?: string[]
}

/**
 * The input for the validate SN codes step.
 */
export type ValidateSnCodesStepInput = {
  /**
   * The items to validate SN codes for.
   */
  items: ValidateSnCodesItem[]
}

export const validateSnCodesStepId = "validate-sn-codes"

/**
 * This step validates SN codes for items during order fulfillment.
 * It checks that SN-managed products have the correct number of unique SN codes.
 *
 * @example
 * const data = validateSnCodesStep({
 *   items: [
 *     {
 *       variant_id: "variant_123",
 *       quantity: 2,
 *       sn_codes: ["SN001", "SN002"]
 *     }
 *   ]
 * })
 */
export const validateSnCodesStep = createStep(
  validateSnCodesStepId,
  async (data: ValidateSnCodesStepInput, { container }) => {
    const productModule = container.resolve<IProductModuleService>(
      Modules.PRODUCT
    )

    const variantIds = data.items.map((item) => item.variant_id)

    const variants = await productModule.listProductVariants(
      { id: variantIds },
      { relations: ["product"] }
    )

    const variantMap = new Map<string, ProductVariantDTO>(
      variants.map((v) => [v.id, v])
    )

    for (const item of data.items) {
      const variant = variantMap.get(item.variant_id)

      if (!variant) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Product variant with id ${item.variant_id} not found`
        )
      }

      const product = variant.product

      if (product?.sn_managed) {
        const snCodes = item.sn_codes ?? []

        if (snCodes.length === 0) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `SN codes are required for SN-managed product variant ${item.variant_id}`
          )
        }

        if (snCodes.length !== item.quantity) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `SN code count (${snCodes.length}) does not match quantity (${item.quantity}) for product variant ${item.variant_id}`
          )
        }

        const uniqueCodes = new Set(snCodes)
        if (uniqueCodes.size !== snCodes.length) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Duplicate SN codes found for product variant ${item.variant_id}`
          )
        }
      }
    }

    return new StepResponse(void 0)
  }
)
