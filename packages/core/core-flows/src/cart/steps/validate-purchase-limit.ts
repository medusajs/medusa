import { IProductModuleService } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The input for the validate purchase limit step.
 */
export interface ValidatePurchaseLimitStepInput {
  /**
   * The items to validate purchase limits for.
   */
  items: Array<{
    /**
     * The ID of the product variant.
     */
    variant_id: string
    /**
     * The quantity to purchase.
     */
    quantity: number
  }>
}

export const validatePurchaseLimitStepId = "validate-purchase-limit"

/**
 * This step validates that the quantity of each item does not exceed
 * the product variant's purchase limit. If any item exceeds its limit,
 * the step throws an error.
 *
 * @example
 * validatePurchaseLimitStep({
 *   items: [
 *     { variant_id: "variant_123", quantity: 2 },
 *   ]
 * })
 */
export const validatePurchaseLimitStep = createStep(
  validatePurchaseLimitStepId,
  async (data: ValidatePurchaseLimitStepInput, { container }) => {
    const { items } = data

    if (!items?.length) {
      return new StepResponse(void 0)
    }

    const variantIds = items.map((item) => item.variant_id)

    const productModule = container.resolve<IProductModuleService>(
      Modules.PRODUCT
    )

    const variants = await productModule.listProductVariants(
      { id: variantIds },
      { select: ["id", "purchase_limit"] }
    )

    const variantMap = new Map(
      variants.map((v) => [v.id, v as typeof v & { purchase_limit?: number | null }])
    )

    for (const item of items) {
      const variant = variantMap.get(item.variant_id)

      if (!variant) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Variant with id ${item.variant_id} was not found`
        )
      }

      const purchaseLimit = variant.purchase_limit

      if (purchaseLimit != null && item.quantity > purchaseLimit) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Variant ${item.variant_id} exceeds purchase limit of ${purchaseLimit}`
        )
      }
    }

    return new StepResponse(void 0)
  }
)
