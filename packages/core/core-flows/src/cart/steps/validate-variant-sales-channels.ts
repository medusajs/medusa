import { MedusaError } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The input for the validate variant sales channels step.
 */
export interface ValidateVariantSalesChannelsStepInput {
  /**
   * The ID of the cart's sales channel. If the cart isn't associated with a
   * sales channel, no validation is performed.
   */
  salesChannelId?: string | null
  /**
   * The variants to validate, along with the sales channels of their product.
   */
  variants: {
    /**
     * The variant's ID.
     */
    id?: string
    /**
     * The variant's product.
     */
    product?: {
      /**
       * The sales channels the product is available in.
       */
      sales_channels?: { id: string }[] | null
      [key: string]: any
    } | null
  }[]
}

export const validateVariantSalesChannelsStepId =
  "validate-variant-sales-channels"
/**
 * This step validates that the products of the specified variants are available
 * in the cart's sales channel. If a variant's product isn't linked to the cart's
 * sales channel, the step throws an error.
 *
 * Only products linked to the cart's sales channel are allowed. A product with
 * no sales channels isn't available in any of them, so the variants must be
 * retrieved with the `product.sales_channels.id` field.
 *
 * @example
 * validateVariantSalesChannelsStep({
 *   salesChannelId: "sc_123",
 *   variants: [
 *     {
 *       id: "variant_123",
 *       product: {
 *         sales_channels: [{ id: "sc_123" }],
 *       },
 *     },
 *   ],
 * })
 */
export const validateVariantSalesChannelsStep = createStep(
  validateVariantSalesChannelsStepId,
  async (data: ValidateVariantSalesChannelsStepInput) => {
    const { salesChannelId, variants } = data

    if (!salesChannelId) {
      return new StepResponse(void 0)
    }

    const unavailableVariantIds = (variants ?? [])
      .filter((variant) => {
        // A product that isn't linked to the cart's sales channel isn't
        // available in it, including when it has no sales channels at all.
        const salesChannels = variant?.product?.sales_channels ?? []

        return !salesChannels.some(
          (salesChannel) => salesChannel?.id === salesChannelId
        )
      })
      .map((variant) => variant.id)

    if (unavailableVariantIds.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Variants with IDs ${unavailableVariantIds.join(
          ", "
        )} are not available in sales channel ${salesChannelId}`
      )
    }

    return new StepResponse(void 0)
  }
)
